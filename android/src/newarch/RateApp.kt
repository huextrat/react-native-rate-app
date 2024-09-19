package com.rateapp

import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.ReactApplicationContext

abstract class RateAppSpec internal constructor(context: ReactApplicationContext) :
  NativeRateAppSpec(context), ActivityEventListener {
}
