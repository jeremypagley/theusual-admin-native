import { Constants } from 'expo';

/**
 * Expo.Constants.manifest comes from app.json
 */
const getManifestExtra = () => {
  return Constants.manifest.extra;
}

/**
 * Expo.Constants.manifest.releaseChannel gets set
 * when doing a publish or build. See https://docs.expo.io/versions/latest/guides/release-channels.html
 */
const getReleaseChannel = () => {
  return Constants.manifest.releaseChannel;
}

/**
 * See for how to version releases and release certain versions
 * under certain environments or even rollback versions.
 * 
 * Overview
 * https://docs.expo.io/versions/latest/guides/release-channels.html
 * 
 * Advanced
 * https://docs.expo.io/versions/latest/distribution/advanced-release-channels
 */
const getKeys = () => {
  const releaseChannel = getReleaseChannel();
  const manifestExtra = getManifestExtra();
  let keys = {
    apiKey: '',
    // apiEndpoint: 'http://localhost:4000/graphql',
    // apiEndpointForgot: 'http://localhost:4000/forgot',

    apiEndpoint: 'http://192.168.0.26:4000/graphql',
    apiEndpointForgot: 'http://192.168.0.26:4000/forgot',
  }

  // Since releaseChannels are undefined in dev, return default.
  if (releaseChannel === undefined) {
    if (keys.apiEndpoint.length === 0) {
      console.group('AppAuth Warnings');
      console.log('* Please provide an apiEndpoint in constants.Auth in dev mode');
      console.groupEnd();
    }

    // keys.apiKey = manifestExtra.PROD_API_KEY;
    // keys.apiEndpoint = manifestExtra.PROD_API_ENDPOINT;
    // keys.s3Bucket = manifestExtra.PROD_DOCUMENT_S3_BUCKET;
    // keys.appEndpoint = manifestExtra.PROD_APP_ENDPOINT;

    /**
     * During development (not releasing) __DEV__ is true. If swapping to prod in expo-cli
     * __DEV__ will be false. If releaseChannels in app.json is undefined we are not releasing
     * but we still need to decide if we are running in dev mode or prod mod while developing the app.
     * The below logic can determine that see https://stackoverflow.com/questions/34315274/react-native-detect-dev-or-production-env/34317341
     *
    if (__DEV__) {
      return keys;

    // production
    } else {
      console.log('Production');
    }*/

    return keys;
  }

  // Return staging environment variables
  if (releaseChannel.indexOf('staging') !== -1) {
    // keys.apiEndpoint = manifestExtra.STAGING_API_ENDPOINT;

    return keys;
  }

  // This would pick up prod-v1, prod-v2, prod-v3
  if (releaseChannel.indexOf('prod') !== -1) {
    keys.apiKey = manifestExtra.PROD_API_KEY;
    keys.apiEndpoint = manifestExtra.PROD_API_ENDPOINT;
    keys.apiEndpointForgot = manifestExtra.PROD_API_ENDPOINT_FORGOT;

    return keys;
  }

  return keys;
  
}

export default {
  getKeys
}
