package com.rateapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class RateAppModule internal constructor(context: ReactApplicationContext) :
  RateAppSpec(context) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun requestReview(promise: Promise) {
    promise.resolve(true)
  }

  @ReactMethod
  override fun openStoreListing(promise: Promise) {
    promise.resolve(true)
  }

  companion object {
    const val NAME = "RateApp"
  }
}
