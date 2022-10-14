package main

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

type telemetryType struct {
	DeviceId       string    `json:"device_id"`
	OrganizationId string    `json:"organization_id"`
	TS             time.Time `json:"ts"`
	Day            string    `json:"day"`
	Key            string    `json:"key"`
	Val            float32   `json:"val"`
	Val2           float32   `json:"val2"`
	Val_Str        string    `json:"val_str"`
	Val2_Str       string    `json:"val2_str"`
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
		"{\"name\":\"val\",\"type\":\"float\"}," +
		"{\"name\":\"val2\",\"type\":\"float\"}," +
		"{\"name\":\"val_str\",\"type\":\"string\"}," +
		"{\"name\":\"val2_str\",\"type\":\"string\"}" +
		"]}"
)

const separator string = ","

func main() {
	log.Println("[Astra Streaming] Starting Pulsar Producer")
	err := godotenv.Load("../.env")

	uri := os.Getenv("STREAMING_URI")
	topicName := os.Getenv("STREAMING_TOPIC_NAME")
	tokenStr := os.Getenv("STREAMING_TOKEN")

	// Constants for the messages
	//args := strings.Split(string(os.Args[1]), "-")
	args := regexp.MustCompile("[\\-\\.]+").Split(filepath.Base(os.Args[1]), -1)
	organization_id := args[0]
	device_id := args[1]
	key := args[2]

	token := pulsar.NewAuthenticationToken(tokenStr)

	client, err := pulsar.NewClient(pulsar.ClientOptions{
		URL:            uri,
		Authentication: token,
	})

	if err != nil {
		log.Fatalf("[Astra Streaming] Could not instantiate Pulsar client: %v", err)
	}

	defer client.Close()

	log.Printf("[Astra Streaming] Creating producer...")
	producerJS := pulsar.NewJSONSchema(tradeSchemaDef, nil)
	// Use the client to instantiate a producer
	producer, err := client.CreateProducer(pulsar.ProducerOptions{
		Topic:  topicName,
		Schema: producerJS,
	})

	log.Printf("[Astra Streaming] Checking error of producer creation...")
	if err != nil {
		log.Fatal(err)
	}

	defer producer.Close()
	log.Printf("[Astra Streaming] Opening file... %s", os.Args[1])

	file, err := os.Open(os.Args[1])
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
		var val, val2 float64
		var val_str, val2_str string

		if key == "latlong" {
			// The lines in the records have a different order (longitude, latitude)
			val_str, val2_str = strings.TrimSpace(s[1]), strings.TrimSpace(s[0])
			val, err = strconv.ParseFloat(val_str, 32)
			val2, err = strconv.ParseFloat(val2_str, 32)
		} else {
			val_str = strings.TrimSpace(s[0])
			val, err = strconv.ParseFloat(val_str, 32)
		}

		msg := pulsar.ProducerMessage{
			Value: &telemetryType{
				TS:             TS,
				OrganizationId: organization_id,
				DeviceId:       device_id,
				Day:            TS.Format("2006-01-02"),
				Key:            key,
				Val:            float32(val),
				Val2:           float32(val2),
				Val_Str:        val_str,
				Val2_Str:       val2_str,
			},
		}

		_, err = producer.Send(ctx, &msg)
		if err != nil {
			log.Fatal(err)
		}
		// log.Printf("[Astra Streaming] File: %s | v: %f / %s | v2: %f / %s | ts: %s", line, val, strings.TrimSpace(s[1]), val2, strings.TrimSpace(s[0]), TS.Format(time.RFC3339))
		log.Printf("[Astra Streaming] File: %s | v: %f / %s | ts: %s", line, val, val_str, TS.Format(time.RFC3339))
		time.Sleep(3 * time.Second)
	}
}

func IfThenElse(condition bool, a interface{}, b interface{}) interface{} {
	if condition {
		return a
	}
	return b
}
