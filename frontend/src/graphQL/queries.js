import { gql } from "@apollo/client";
export const GET_LATEST = gql`
  query getLatest($org: String!, $key: String!, $lastTS: Timestamp) {
    telemetry_latest(
      options: { pageSize: 100 }
      filter: {
        organization_id: { eq: $org }
        key: { eq: $key }
        ts: { gt: $lastTS }
      }
    ) {
      values {
        lat: value
        lng: value2
        device_id
        ts
      }
    }
  }
`;

export const GET_TELEMETRY = gql`
  query getTracking(
    $org: String
    $dev: String
    $key: String
    $lastDay: Date
    $lastTS: Timestamp
  ) {
    telemetry(
      options: { pageSize: 1000 }
      filter: {
        organization_id: { eq: $org }
        device_id: { eq: $dev }
        key: { eq: $key }
        day: { eq: $lastDay }
        ts: { gt: $lastTS }
      }
    ) {
      values {
        lat: value
        lng: value2
        ts
      }
    }
  }
`;

export const GET_TELEMETRY_LATEST_BY_DEVICE = gql`
  query getLatestByDevice($org: String, $dev: String, $lastTS: Timestamp) {
    telemetry_latest(
      options: { pageSize: 100 }
      filter: {
        organization_id: { eq: $org }
        device_id: { eq: $dev }
        ts: { gt: $lastTS }
      }
    ) {
      values {
        value
        value2
        key
        ts
      }
    }
  }
`;

export const GET_DEVICE = gql`
  query getDevice($org: String, $dev: String) {
    devices(
      options: { pageSize: 1 }
      filter: { organization_id: { eq: $org }, device_id: { eq: $dev } }
    ) {
      values {
        name
        description
      }
    }
  }
`;



export const GET_ALERTS_BY_DEVICE = gql`
  query getTracking(
    $org: String
    $dev: String
    $lastDay: Date
    $lastTS: Timestamp
  ) {
    alert(
      options: { pageSize: 1000 }
      filter: {
        organization_id: { eq: $org }
        device_id: { eq: $dev }
        day: { eq: $lastDay }
        ts: { gt: $lastTS }
      }
    ) {
      values {
        ts
        value
        alert_message
      }
    }
  }
`;