package producer

import (
	"bufio"
	"context"
	"io"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/apache/pulsar-client-go/pulsar"
	"github.com/joho/godotenv"
)

// type ProducerService interface {
// 	Produce(filename string)
// }

type ProducerService struct {
}

type telemetryType struct {
	DeviceId       string    `json:"device_id"`
	OrganizationId string    `json:"organization_id"`
	TS             time.Time `json:"ts"`
	Day            string    `json:"day"`
	Key            string    `json:"key"`
	Value          float32   `json:"value"`
	Value2         float32   `json:"value2"`
}

var (
	// Estrutura de dados para envio ao Astra Streaming
	tradeSchemaDef = "{\"type\":\"record\",\"name\":\"Telemetry\",\"namespace\":\"demo\"," +
		"\"fields\":[" +
		"{\"name\":\"ts\",\"type\":\"string\"}," +
		"{\"name\":\"day\",\"type\":\"string\"}," +
		"{\"name\":\"organization_id\",\"type\":\"string\"}," +
		"{\"name\":\"device_id\",\"type\":\"string\"}," +
		"{\"name\":\"key\",\"type\":\"string\"}," +
		"{\"name\":\"value\",\"type\":\"float\"}," +
		"{\"name\":\"value2\",\"type\":\"float\"}" +
		"]}"
	separator string = ","
	topicName string
	uri       string
	tokenStr  string
	client    pulsar.Client
)

func init() {

	log.Println("[Astra Streaming] Starting Pulsar Client")
	err := godotenv.Load("../.env")

	uri = os.Getenv("STREAMING_URI")
	topicName = os.Getenv("STREAMING_TOPIC_NAME")
	tokenStr := os.Getenv("STREAMING_TOKEN")

	// Constants for the messages
	//args := strings.Split(string(os.Args[1]), "-")

	token := pulsar.NewAuthenticationToken(tokenStr)

	client, err = pulsar.NewClient(pulsar.ClientOptions{
		URL:            uri,
		Authentication: token,
	})

	if err != nil {
		log.Fatalf("[Astra Streaming] Could not instantiate Pulsar client: %v", err)
	}

	defer client.Close()

}

func (producer ProducerService) Produce(filename string) {
	log.Println("[Astra Streaming] Starting Pulsar Producer: %s", filename)
	args := regexp.MustCompile("[\\-\\.]+").Split(filepath.Base(filename), -1)
	organization_id := args[0]
	device_id := args[1]
	key := args[2]

	log.Printf("[Astra Streaming] Creating producer...")
	producerJS := pulsar.NewJSONSchema(tradeSchemaDef, nil)
	// Use the client to instantiate a producer
	p, err := client.CreateProducer(pulsar.ProducerOptions{
		Topic:  topicName,
		Schema: producerJS,
	})

	log.Printf("[Astra Streaming] Checking error of producer creation...")
	if err != nil {
		log.Fatal(err)
	}

	defer p.Close()
	log.Printf("[Astra Streaming] Opening file... %s", filename)

	file, err := os.Open("./tmp/" + filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	reader := bufio.NewReader(file)
	ctx := context.Background()

	for {
		line, _, err := reader.ReadLine()

		if err == io.EOF {
			break
		}

		TS := time.Now()

		s := strings.Split(string(line), separator)
		var value, value2 float64
		var value_str, value2_str string

		if key == "latlong" {
			// The lines in the records have a different order (longitude, latitude)
			value_str, value2_str = strings.TrimSpace(s[1]), strings.TrimSpace(s[0])
			value, err = strconv.ParseFloat(value_str, 32)
			value2, err = strconv.ParseFloat(value2_str, 32)
		} else {
			value_str = strings.TrimSpace(s[0])
			value, err = strconv.ParseFloat(value_str, 32)
		}

		msg := pulsar.ProducerMessage{
			Key: organization_id + "-" + device_id + "-" + key + "-" + TS.Format(time.RFC3339),
			Value: &telemetryType{
				TS:             TS,
				OrganizationId: organization_id,
				DeviceId:       device_id,
				Day:            TS.Format("2006-01-02"),
				Key:            key,
				Value:          float32(value),
				Value2:         float32(value2),
			},
			EventTime: time.Now(),
		}

		_, err = p.Send(ctx, &msg)
		if err != nil {
			log.Fatal(err)
		}
		// log.Printf("[Astra Streaming] File: %s | v: %f / %s | v2: %f / %s | ts: %s", line, val, strings.TrimSpace(s[1]), val2, strings.TrimSpace(s[0]), TS.Format(time.RFC3339))
		log.Printf("[Astra Streaming-%s] : %s | v: %f / %s | ts: %s", filename, line, value, value_str, TS.Format(time.RFC3339))
		time.Sleep(3 * time.Second)
	}
}

func IfThenElse(condition bool, a interface{}, b interface{}) interface{} {
	if condition {
		return a
	}
	return b
}
