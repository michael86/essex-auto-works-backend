import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";

const KEY = process.env.BREVO_API_KEY;
if (!KEY) {
  console.error("BREVO_API_KEY missing from env");
  process.exit(1);
}

const transactionalApi = new TransactionalEmailsApi();
transactionalApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, KEY);

export default transactionalApi;
