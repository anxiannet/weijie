import {appEnv, hasR2Config} from '@/lib/env';

const R2_ENV_KEYS = [
  'CLOUDFLARE_R2_ACCOUNT_ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET',
  'CLOUDFLARE_R2_PUBLIC_BASE_URL',
] as const;

type R2EnvKey = (typeof R2_ENV_KEYS)[number];

function maskValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  if (value.length <= 8) {
    return `${value.slice(0, 1)}...${value.slice(-1)}`;
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function getPublicBaseUrlStatus(value: string | undefined) {
  if (!value) {
    return {isValidUrl: false, origin: null};
  }

  try {
    const url = new URL(value);
    return {
      isValidUrl: url.protocol === 'https:',
      origin: url.origin,
    };
  } catch {
    return {isValidUrl: false, origin: null};
  }
}

export function getR2Diagnostics() {
  const directEnv = R2_ENV_KEYS.map((key) => {
    const value = process.env[key];

    return {
      key,
      present: Boolean(value),
      length: value?.length ?? 0,
      masked: maskValue(value),
    };
  });

  const missingKeys = directEnv.filter((item) => !item.present).map((item) => item.key);
  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL;

  return {
    checkedAt: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV ?? null,
    nextRuntime: process.env.NEXT_RUNTIME ?? 'nodejs',
    vercelEnv: process.env.VERCEL_ENV ?? null,
    vercelRegion: process.env.VERCEL_REGION ?? process.env.VERCEL_FUNCTION_REGION ?? null,
    hasR2Config: hasR2Config(),
    directProcessEnvReady: missingKeys.length === 0,
    missingKeys,
    publicBaseUrlStatus: getPublicBaseUrlStatus(publicBaseUrl),
    variables: directEnv,
    appEnvSnapshot: {
      r2AccountId: Boolean(appEnv.r2AccountId),
      r2AccessKeyId: Boolean(appEnv.r2AccessKeyId),
      r2SecretAccessKey: Boolean(appEnv.r2SecretAccessKey),
      r2Bucket: Boolean(appEnv.r2Bucket),
      r2PublicBaseUrl: Boolean(appEnv.r2PublicBaseUrl),
    },
  };
}

export type R2Diagnostics = ReturnType<typeof getR2Diagnostics>;
export type {R2EnvKey};
