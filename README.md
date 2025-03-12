# React Native Rate App

<p align="center">
  A powerful and easy-to-use library for implementing in-app ratings in React Native applications.
</p>

<p align="center">
  <a href="https://github.com/huextrat/react-native-rate-app/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/react-native-rate-app">
    <img alt="npm version" src="https://img.shields.io/npm/v/react-native-rate-app.svg" />
  </a>
  <a href="https://www.npmjs.com/package/react-native-rate-app">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/react-native-rate-app.svg" />
  </a>
</p>

## Features

- 🚀 Easy integration with React Native projects
- 🔄 Cross-platform support (iOS and Android)
- 📱 Supports Android 5+ (API level 21+) and iOS 14+
- 🏗️ Supports the new architecture for React Native
- 🛒 Supports multiple app stores:
  - Google Play Store
  - Samsung Galaxy Store
  - Huawei AppGallery
  - Apple App Store (iOS)

## Installation

```sh
yarn add react-native-rate-app
```
or
```sh
npm install react-native-rate-app
```

## Expo

For Expo projects, you can use the Expo plugin in `app.json`

```json
"plugins": [
  "react-native-rate-app"
],
```

## Bare RN

### iOS Setup

To use the in-app review functionality on iOS, you need to add the `StoreKit` framework to your project and update your `Info.plist` file.

#### Adding the StoreKit Framework

1. Open your project in Xcode.
2. Select your project in the Project Navigator.
3. Select your app target.
4. Go to the "Build Phases" tab.
5. Expand the "Link Binary With Libraries" section.
6. Click the "+" button and add `StoreKit.framework`.

#### Updating Info.plist

To allow your app to open the App Store and handle the in-app review functionality, you need to add the `LSApplicationQueriesSchemes` key to your `Info.plist` file.

1. Open your `Info.plist` file.
2. Add `itms-apps` string

Example:
```xml
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>itms-apps</string>
</array>
```

## API Reference

This library will throw an error if something goes wrong during the execution of its methods. Make sure to handle these errors appropriately in your application.

### `RateApp.requestReview(options)`

Requests a review from the user using the native in-app review dialog.

#### Parameters

- `options` (optional): An object containing the following properties:
  - `androidMarket` (optional): The market where the app's review request should be directed on Android. Defaults to `AndroidMarket.GOOGLE`. Supported values are:
    - `AndroidMarket.GOOGLE`: Google Play Store
    - `AndroidMarket.SAMSUNG`: Samsung Galaxy Store
    - `AndroidMarket.HUAWEI`: Huawei AppGallery
  - `androidPackageName` (optional): The package name of the app to request a review for on Samsung Galaxy Store.

#### Example

```javascript
const result = await RateApp.requestReview();
console.log(result); // true if successful, false otherwise
```

### Important Note on Huawei AppGallery and Samsung Galaxy Store In-App Rating

Please note that the in-app rating functionality for Huawei AppGallery and Samsung Galaxy Store has not been thoroughly tested. While the implementation follows the respective guidelines, we recommend conducting your own tests to ensure compatibility and functionality within your application environment.

#### Huawei AppGallery Requirements

To enable in-app reviews for the Huawei AppGallery, ensure that your app is correctly configured with Huawei Mobile Services (HMS). This functionality leverages [Huawei In-App Comments](https://developer.huawei.com/consumer/en/doc/AppGallery-connect-Guides/agc-comments-develop-0000001062858332) mechanism.

#### Samsung Galaxy Store Requirements

To enable in-app reviews for the Samsung Galaxy Store, ensure that your app is correctly configured. You must provide the `androidPackageName` specific to the Samsung Galaxy Store. This functionality leverages the [Galaxy Store Broadcast](https://developer.samsung.com/galaxy-store/customer-review/galaxy-store-review-broadcast.html) mechanism.

### Important Notes

- **Quotas**: In-app reviews are subject to rate limits set by the operating system. This means the review dialog might not always appear to the user, depending on how often it has been requested previously. Note that `requestReview` will return `true` even if the rate limits have been reached. For more information, please refer to the official documentation from Apple and Google.
- **Development Mode**: The in-app review dialog is always displayed in development mode, regardless of rate limits. This is useful for testing purposes.
- **Best Practices**: According to operating system guidelines, it is recommended to request a review during a natural flow in your app, rather than from a button. For example, you might request a review after a user has completed a task or achieved a milestone within your app.

[Apple Documentation iOS 14+](https://developer.apple.com/documentation/storekit/skstorereviewcontroller/3566727-requestreview#discussion)<br>
[Apple Documentation iOS 16+](https://developer.apple.com/documentation/storekit/requestreviewaction)<br>
[Google Documentation](https://developer.android.com/guide/playcore/in-app-review)

Below iOS 16 library is using the deprecated SKStoreReviewController and on iOS 16+ it uses the new RequestReviewAction API. Both implementations provide the same functionality and user experience.

### `RateApp.openStoreForReview(options)`

Opens the app store page for the app, allowing the user to leave a review.

```javascript
const result = await RateApp.openStoreForReview({
    iOSAppId: "your-ios-app-id", // Required on iOS, macOS
    androidPackageName: "your.android.package.name", // Required on Android
    androidMarket: AndroidMarket.GOOGLE, // Optional, defaults to GOOGLE
});
console.log(result); // true if successful, false otherwise
```

### Supported Android Markets

The `androidMarket` option in `RateApp.openStoreForReview` supports the following markets:

- `AndroidMarket.GOOGLE`: Google Play Store
- `AndroidMarket.AMAZON`: Amazon Appstore
- `AndroidMarket.SAMSUNG`: Samsung Galaxy Store
- `AndroidMarket.HUAWEI`: Huawei AppGallery

### Updating Info.plist

You need to add the `LSApplicationQueriesSchemes` key to your `Info.plist` file to allow your app to open the App Store.

1. Open your `Info.plist` file.
2. Add the following entry:


## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you like this project, please consider supporting it by giving it a ⭐️ on GitHub!

## Acknowledgements

- [create-react-native-library](https://github.com/callstack/react-native-builder-bob) for the initial project setup