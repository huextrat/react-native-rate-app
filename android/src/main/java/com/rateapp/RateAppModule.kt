package com.rateapp

import android.app.Activity;
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.Uri

import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.module.annotations.ReactModule

import com.google.android.play.core.review.ReviewManager
import com.google.android.play.core.review.ReviewManagerFactory

@ReactModule(name = RateAppModule.NAME)
class RateAppModule(reactContext: ReactApplicationContext) :
  RateAppSpec(reactContext), ActivityEventListener {

  init {
    reactContext.addActivityEventListener(this)
  }

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
          currentActivity?.let { activity ->
            val flow = manager.launchReviewFlow(activity, it)
            flow.addOnCompleteListener { result ->
              if (result.isSuccessful) {
                promise.resolve(true)
              } else {
                promise.reject("REVIEW_FLOW_FAILED", "Review flow failed to complete")
              }
            }
          } ?: promise.reject("ACTIVITY_NULL", "Current activity is null")
        } ?: promise.reject("REVIEW_INFO_NULL", "Review info is null")
      } else {
        promise.reject("REQUEST_REVIEW_FLOW_FAILED", "Request review flow failed")
      }
    }
  }

  @ReactMethod
  override fun requestReviewAppGallery(promise: Promise) {
    promiseAppGallery = promise;
    val intent = Intent("com.huawei.appmarket.intent.action.guidecomment")
    intent.setPackage("com.huawei.appmarket")
    currentActivity?.let {
      it.startActivityForResult(intent, 1001);
    } ?: promise.reject("ACTIVITY_NULL", "Current activity is null")
  }

  override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
    if (requestCode == REQUEST_CODE) {
      if (resultCode == Activity.RESULT_OK) {
        promiseAppGallery?.resolve(true)
      } else {
        promiseAppGallery?.reject("REVIEW_NOT_COMPLETED", resultCode.toString())
      }
    }
  }

  @ReactMethod
  override fun requestReviewGalaxyStore(packageName: String, promise: Promise) {
    val ai = reactApplicationContext.packageManager.getApplicationInfo("com.sec.android.app.samsungapps", PackageManager.GET_META_DATA)
    val inappReviewVersion = ai.metaData.getInt("com.sec.android.app.samsungapps.review.inappReview", 0)
    if (inappReviewVersion > 0) {
      promiseGalaxyStore = promise

      val intent = Intent("com.sec.android.app.samsungapps.REQUEST_INAPP_REVIEW_AUTHORITY")
      intent.setPackage("com.sec.android.app.samsungapps")
      intent.putExtra("callerPackage", packageName)
      reactApplicationContext.sendBroadcast(intent)

      val filter = IntentFilter()
      filter.addAction("com.sec.android.app.samsungapps.RESPONSE_INAPP_REVIEW_AUTHORITY")
      reactApplicationContext.registerReceiver(authorityReceiver, filter)
    } else {
      promise.reject("NOT_SUPPORTED", "Galaxy Store does not support in-app review")
    }
  }

  private val authorityReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
      val hasAuthority = intent.getBooleanExtra("hasAuthority", false)
      val deeplinkUri = intent.getStringExtra("deeplinkUri")

      if (hasAuthority) {
        val deeplinkIntent = Intent().apply {
          data = Uri.parse(deeplinkUri)
          addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_INCLUDE_STOPPED_PACKAGES)
        }
        currentActivity?.let {
          it.startActivity(deeplinkIntent)
          promiseGalaxyStore?.resolve(true)
        } ?: promiseGalaxyStore?.reject("ACTIVITY_NULL", "Current activity is null")
      } else {
        promiseGalaxyStore?.reject("NO_AUTHORITY", "No authority to write review")
      }
      reactApplicationContext.unregisterReceiver(this)
    }
  }

  fun onNewIntent(intent: Intent) {
    // No-op
  }

  companion object {
    const val NAME = "RateApp"
    const val REQUEST_CODE = 1001
    private var promiseAppGallery: Promise? = null
    private var promiseGalaxyStore: Promise? = null
  }
}
