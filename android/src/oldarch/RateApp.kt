package com.rateapp

import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise

abstract class RateAppSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context), ActivityEventListener {

  abstract fun requestReview(promise: Promise)
  abstract fun requestReviewAppGallery(promise: Promise)
  abstract fun requestReviewGalaxyStore(packageName: String, promise: Promise)
}