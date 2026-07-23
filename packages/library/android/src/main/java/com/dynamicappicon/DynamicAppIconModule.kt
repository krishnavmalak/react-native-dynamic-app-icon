package com.dynamicappicon

import android.content.ComponentName
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule

@ReactModule(name = NativeDynamicAppIconSpec.NAME)
class DynamicAppIconModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = NativeDynamicAppIconSpec.NAME

    @ReactMethod
    fun changeIcon(iconName: String, promise: Promise) {
        try {
            val packageName = reactContext.packageName
            val pm = reactContext.packageManager

            val normalizedTarget = iconName.trim().lowercase()
            val isDefaultTarget = normalizedTarget == "default" || normalizedTarget.isEmpty()

            val components = getAllActivityComponents(pm, packageName)

            if (components.isEmpty()) {
                promise.reject("ICON_CHANGE_FAILED", "No activity components found in package manifest.")
                return
            }

            var targetFound = false

            for (component in components) {
                val className = component.className

                // DO NOT disable host MainActivity. Only toggle activity-aliases.
                if (className == "$packageName.MainActivity" || className.endsWith(".MainActivity")) {
                    continue
                }

                if (!className.contains("MainActivity")) {
                    continue
                }

                val isDefaultAlias = className.endsWith(".MainActivityDefault", ignoreCase = true)

                val shouldEnable = if (isDefaultTarget) {
                    isDefaultAlias
                } else {
                    className.endsWith("MainActivity$iconName", ignoreCase = true) ||
                    className.endsWith("MainActivity_$iconName", ignoreCase = true) ||
                    className.endsWith(".$iconName", ignoreCase = true)
                }

                if (shouldEnable) {
                    targetFound = true
                }

                val newState = if (shouldEnable) {
                    PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                } else {
                    PackageManager.COMPONENT_ENABLED_STATE_DISABLED
                }

                pm.setComponentEnabledSetting(
                    component,
                    newState,
                    PackageManager.DONT_KILL_APP
                )
            }

            if (!isDefaultTarget && !targetFound) {
                promise.reject(
                    "ICON_NOT_FOUND",
                    "Activity alias for icon '$iconName' was not found in AndroidManifest.xml"
                )
                return
            }

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ICON_CHANGE_FAILED", e.message, e)
        }
    }

    @ReactMethod
    fun restoreDefaultIcon(promise: Promise) {
        changeIcon("Default", promise)
    }

    @ReactMethod
    fun getCurrentIcon(promise: Promise) {
        try {
            val pm = reactContext.packageManager
            val packageName = reactContext.packageName
            val components = getAllActivityComponents(pm, packageName)

            for (component in components) {
                val className = component.className

                // Skip host MainActivity
                if (className == "$packageName.MainActivity" || className.endsWith(".MainActivity")) {
                    continue
                }

                if (!className.contains("MainActivity")) {
                    continue
                }

                val state = pm.getComponentEnabledSetting(component)
                if (state == PackageManager.COMPONENT_ENABLED_STATE_ENABLED) {
                    val namePart = className.substringAfterLast("MainActivity", "")
                    if (namePart.isNotEmpty() && !namePart.equals("Default", ignoreCase = true)) {
                        promise.resolve(namePart)
                        return
                    }
                }
            }

            promise.resolve("Default")
        } catch (e: Exception) {
            promise.reject("GET_ICON_FAILED", e.message, e)
        }
    }

    private fun getAllActivityComponents(pm: PackageManager, packageName: String): List<ComponentName> {
        val flags = PackageManager.GET_ACTIVITIES or
                    PackageManager.GET_DISABLED_COMPONENTS

        val packageInfo = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            pm.getPackageInfo(
                packageName,
                PackageManager.PackageInfoFlags.of(flags.toLong())
            )
        } else {
            @Suppress("DEPRECATION")
            pm.getPackageInfo(packageName, flags)
        }

        val activities = packageInfo.activities ?: return emptyList()
        return activities.map { ComponentName(packageName, it.name) }
    }

    @ReactMethod
    fun showSplash(configStr: String, promise: Promise) {
        promise.resolve(null)
    }

    @ReactMethod
    fun hideSplash(promise: Promise) {
        promise.resolve(null)
    }
}
