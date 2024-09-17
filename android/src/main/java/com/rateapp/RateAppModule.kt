package com.rateapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

import com.google.android.play.core.review.ReviewManager
import com.google.android.play.core.review.ReviewManagerFactory

class RateAppModule internal constructor(context: ReactApplicationContext) :
  RateAppSpec(context) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun requestReview(promise: Promise) {
    val manager: ReviewManager = ReviewManagerFactory.create(reactApplicationContext)
    val request = manager.requestReviewFlow()
    request.addOnCompleteListener { task ->
      if (task.isSuccessful) {
        val reviewInfo = task.result
        reviewInfo?.let {
          val activity = currentActivity
          if (activity != null) {
            val flow = manager.launchReviewFlow(activity, it)
            flow.addOnCompleteListener { result ->
              if (result.isSuccessful) {
                promise.resolve(true)
              } else {
                promise.reject("REVIEW_FLOW_FAILED", "Review flow failed to complete")
              }
            }
          }
        } ?: promise.reject("REVIEW_INFO_NULL", "Review info is null")
      } else {
        promise.reject("REQUEST_REVIEW_FLOW_FAILED", "Request review flow failed")
      }
    }
  }

  companion object {
    const val NAME = "RateApp"
  }
}
