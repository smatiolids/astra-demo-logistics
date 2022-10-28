package entity

import "time"

type telemetryType struct {
	DeviceId       string    `json:"device_id"`
	OrganizationId string    `json:"organization_id"`
	TS             time.Time `json:"ts"`
	Day            string    `json:"day"`
	Key            string    `json:"key"`
	Value          float32   `json:"value"`
	Value2         float32   `json:"value2"`
}
