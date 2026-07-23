package com.dynamicappicon

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

abstract class NativeDynamicAppIconSpec(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    @ReactMethod
    abstract fun changeIcon(iconName: String, promise: Promise)

    @ReactMethod
    abstract fun restoreDefaultIcon(promise: Promise)

    @ReactMethod
    abstract fun getCurrentIcon(promise: Promise)

    @ReactMethod
    abstract fun showSplash(configStr: String, promise: Promise)

    @ReactMethod
    abstract fun hideSplash(promise: Promise)

    companion object {
        const val NAME = "DynamicAppIcon"
    }
}
