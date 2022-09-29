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
	Value          float64   `json:"value"`
	Value2         float64   `json:"value2"`
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

		s := strings.Split(string(line), separator)

		// The lines in the records have a different order (longitude, latitude)
		value, err := strconv.ParseFloat(strings.TrimSpace(s[1]), 64)
		value2, err := strconv.ParseFloat(strings.TrimSpace(s[0]), 64)
		TS := time.Now()

		msg := pulsar.ProducerMessage{
			Value: &telemetryType{
				TS:             TS,
				OrganizationId: organization_id,
				DeviceId:       device_id,
				Day:            TS.Format("2006-01-02"),
				Key:            key,
				Value:          value,
				Value2:         value2,
			},
		}

		_, err = producer.Send(ctx, &msg)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("[Astra Streaming] Published message: %s", line)
		time.Sleep(1 * time.Second)
	}
}
