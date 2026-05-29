/**
 * Development environment configuration.
 * apiGatewayUrl is intentionally empty so that Angular's dev-server proxy
 * (proxy.conf.json) intercepts /question-service/** and /quiz-service/**
 * and forwards them to the API Gateway at localhost:8765.
 */
export const environment = {
  production: false,
  apiGatewayUrl: ''   // Empty → proxy handles the forwarding during `ng serve`
};
