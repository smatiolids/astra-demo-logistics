package com.astra.logisticsdemo;

import org.apache.pulsar.common.schema.SchemaType;
import org.apache.pulsar.client.api.schema.GenericRecord;
import org.apache.pulsar.client.api.Schema;
import org.apache.pulsar.functions.api.Context;
import org.apache.pulsar.functions.api.Function;
import org.apache.pulsar.client.api.MessageId;
import org.apache.pulsar.client.api.schema.GenericRecordBuilder;
import org.apache.pulsar.client.api.schema.GenericSchema;
import org.apache.pulsar.client.api.schema.RecordSchemaBuilder;
import org.apache.pulsar.client.api.schema.SchemaBuilder;

public class CheckSpeedFunction implements Function<GenericRecord, Void> {
    private RecordSchemaBuilder builder;
    private GenericSchema<GenericRecord> schema;
    final String speed_key = "speed";
    final float speed_limit = 55;

    @Override
    public void initialize(Context context) {
        /**
         * Define the schema for the messages
         */
        builder = SchemaBuilder.record("Alert");
        builder.field("ts").type(SchemaType.STRING);
        builder.field("day").type(SchemaType.STRING);
        builder.field("organization_id").type(SchemaType.STRING);
        builder.field("device_id").type(SchemaType.STRING);
        builder.field("key").type(SchemaType.STRING);
        builder.field("value").type(SchemaType.FLOAT);
        builder.field("value2").type(SchemaType.FLOAT);
        builder.field("alert_message").type(SchemaType.STRING);
        schema = Schema.generic(builder.build(SchemaType.JSON));
        context.getLogger().info("Schema defined");
        context.getLogger().info(context.getOutputTopic());
    }

    @Override
    public Void process(GenericRecord input, Context context) throws Exception {

        String input_key = input.getField("key").toString();
        float input_val = Float.valueOf(input.getField("value").toString());

        if (input_key.equals(speed_key)
                && (Float.compare(input_val, speed_limit) > 0)) {
            /*
             * Create the record based on the source record, adds a message and send
             */
            GenericRecordBuilder recordBuilder = schema.newRecordBuilder();

            this.schema.getFields().stream().forEach(f -> {
                if (input.getField(f.getName()) != null) {
                    recordBuilder.set(f.getName(), input.getField(f.getName()));
                }
            });

            recordBuilder.set("alert_message", "Speed limit warning");

            MessageId sendResult = context.newOutputMessage(context.getOutputTopic(), schema)
                    .property("processor", "AlertRule:CheckSpeed")
                    .eventTime(System.currentTimeMillis())
                    .value(recordBuilder.build())
                    .send();

            context.getLogger().info("[Alert produced]: MessageId " + sendResult.toString());
        }

        return null;
    }

}
