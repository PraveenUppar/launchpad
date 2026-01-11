import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const traceExporter = new OTLPTraceExporter({
  url:
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
    'http://localhost:4318/v1/traces',
});

export const otelSDK = new NodeSDK({
  serviceName: 'todo-backend',
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

export const startTracing = async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('Tracing disabled in test env');
    return;
  }
  await otelSDK.start();
  console.log('OpenTelemetry tracing initialized');
};

export const stopTracing = async () => {
  await otelSDK.shutdown();
};
