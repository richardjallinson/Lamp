#!/usr/bin/env python3
"""Write app/Lamp.xcodeproj (project file and shared scheme). Run again after adding Swift files.

  python3 app/tools/make_xcodeproj.py
"""
import hashlib
import os

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJ = os.path.join(APP, "Lamp.xcodeproj")
BUNDLE_ID = "com.richardallinson.Lamp"
DEPLOY = "16.0"


def uid(name):
    return hashlib.md5(("lamp:" + name).encode()).hexdigest()[:24].upper()


swift = sorted(f for f in os.listdir(os.path.join(APP, "Lamp")) if f.endswith(".swift"))
resources = ["Assets.xcassets", "PrivacyInfo.xcprivacy"]
other = ["Info.plist", "Lamp.entitlements", "Lamp.storekit"]
ftype = {".swift": "sourcecode.swift", ".xcassets": "folder.assetcatalog", ".xcprivacy": "text.xml",
         ".plist": "text.plist.xml", ".entitlements": "text.plist.entitlements", ".storekit": "text.json"}

o = []
w = o.append
w("// !$*UTF8*$!\n{\n\tarchiveVersion = 1;\n\tclasses = {\n\t};\n\tobjectVersion = 56;\n\tobjects = {\n")
w("\n/* Begin PBXBuildFile section */\n")
for f in swift:
    w(f"\t\t{uid('bf'+f)} /* {f} in Sources */ = {{isa = PBXBuildFile; fileRef = {uid('fr'+f)} /* {f} */; }};\n")
for f in resources + ["www"]:
    w(f"\t\t{uid('bf'+f)} /* {f} in Resources */ = {{isa = PBXBuildFile; fileRef = {uid('fr'+f)} /* {f} */; }};\n")
w("/* End PBXBuildFile section */\n\n/* Begin PBXFileReference section */\n")
w(f"\t\t{uid('product')} /* Lamp.app */ = {{isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = Lamp.app; sourceTree = BUILT_PRODUCTS_DIR; }};\n")
for f in swift + resources + other:
    t = ftype[os.path.splitext(f)[1]]
    w(f"\t\t{uid('fr'+f)} /* {f} */ = {{isa = PBXFileReference; lastKnownFileType = {t}; path = {f}; sourceTree = \"<group>\"; }};\n")
w(f"\t\t{uid('frwww')} /* www */ = {{isa = PBXFileReference; lastKnownFileType = folder; path = www; sourceTree = \"<group>\"; }};\n")
w("/* End PBXFileReference section */\n\n/* Begin PBXFrameworksBuildPhase section */\n")
w(f"\t\t{uid('frameworks')} /* Frameworks */ = {{\n\t\t\tisa = PBXFrameworksBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = (\n\t\t\t);\n\t\t\trunOnlyForDeploymentPostprocessing = 0;\n\t\t}};\n")
w("/* End PBXFrameworksBuildPhase section */\n\n/* Begin PBXGroup section */\n")
w(f"\t\t{uid('maingroup')} = {{\n\t\t\tisa = PBXGroup;\n\t\t\tchildren = (\n\t\t\t\t{uid('lampgroup')} /* Lamp */,\n\t\t\t\t{uid('frwww')} /* www */,\n\t\t\t\t{uid('productsgroup')} /* Products */,\n\t\t\t);\n\t\t\tsourceTree = \"<group>\";\n\t\t}};\n")
w(f"\t\t{uid('productsgroup')} /* Products */ = {{\n\t\t\tisa = PBXGroup;\n\t\t\tchildren = (\n\t\t\t\t{uid('product')} /* Lamp.app */,\n\t\t\t);\n\t\t\tname = Products;\n\t\t\tsourceTree = \"<group>\";\n\t\t}};\n")
kids = "".join(f"\t\t\t\t{uid('fr'+f)} /* {f} */,\n" for f in swift + resources + other)
w(f"\t\t{uid('lampgroup')} /* Lamp */ = {{\n\t\t\tisa = PBXGroup;\n\t\t\tchildren = (\n{kids}\t\t\t);\n\t\t\tpath = Lamp;\n\t\t\tsourceTree = \"<group>\";\n\t\t}};\n")
w("/* End PBXGroup section */\n\n/* Begin PBXNativeTarget section */\n")
w(f"""\t\t{uid('target')} /* Lamp */ = {{
\t\t\tisa = PBXNativeTarget;
\t\t\tbuildConfigurationList = {uid('targetconfigs')} /* Build configuration list for PBXNativeTarget "Lamp" */;
\t\t\tbuildPhases = (
\t\t\t\t{uid('sources')} /* Sources */,
\t\t\t\t{uid('frameworks')} /* Frameworks */,
\t\t\t\t{uid('resources')} /* Resources */,
\t\t\t);
\t\t\tbuildRules = (
\t\t\t);
\t\t\tdependencies = (
\t\t\t);
\t\t\tname = Lamp;
\t\t\tproductName = Lamp;
\t\t\tproductReference = {uid('product')} /* Lamp.app */;
\t\t\tproductType = "com.apple.product-type.application";
\t\t}};
""")
w("/* End PBXNativeTarget section */\n\n/* Begin PBXProject section */\n")
w(f"""\t\t{uid('project')} /* Project object */ = {{
\t\t\tisa = PBXProject;
\t\t\tattributes = {{
\t\t\t\tBuildIndependentTargetsInParallel = 1;
\t\t\t\tLastSwiftUpdateCheck = 1500;
\t\t\t\tLastUpgradeCheck = 1500;
\t\t\t\tTargetAttributes = {{
\t\t\t\t\t{uid('target')} = {{
\t\t\t\t\t\tCreatedOnToolsVersion = 15.0;
\t\t\t\t\t}};
\t\t\t\t}};
\t\t\t}};
\t\t\tbuildConfigurationList = {uid('projconfigs')} /* Build configuration list for PBXProject "Lamp" */;
\t\t\tcompatibilityVersion = "Xcode 14.0";
\t\t\tdevelopmentRegion = en;
\t\t\thasScannedForEncodings = 0;
\t\t\tknownRegions = (
\t\t\t\ten,
\t\t\t\tBase,
\t\t\t);
\t\t\tmainGroup = {uid('maingroup')};
\t\t\tproductRefGroup = {uid('productsgroup')} /* Products */;
\t\t\tprojectDirPath = "";
\t\t\tprojectRoot = "";
\t\t\ttargets = (
\t\t\t\t{uid('target')} /* Lamp */,
\t\t\t);
\t\t}};
""")
w("/* End PBXProject section */\n\n/* Begin PBXResourcesBuildPhase section */\n")
res = "".join(f"\t\t\t\t{uid('bf'+f)} /* {f} in Resources */,\n" for f in resources + ["www"])
w(f"\t\t{uid('resources')} /* Resources */ = {{\n\t\t\tisa = PBXResourcesBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = (\n{res}\t\t\t);\n\t\t\trunOnlyForDeploymentPostprocessing = 0;\n\t\t}};\n")
w("/* End PBXResourcesBuildPhase section */\n\n/* Begin PBXSourcesBuildPhase section */\n")
src = "".join(f"\t\t\t\t{uid('bf'+f)} /* {f} in Sources */,\n" for f in swift)
w(f"\t\t{uid('sources')} /* Sources */ = {{\n\t\t\tisa = PBXSourcesBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = (\n{src}\t\t\t);\n\t\t\trunOnlyForDeploymentPostprocessing = 0;\n\t\t}};\n")
w("/* End PBXSourcesBuildPhase section */\n\n/* Begin XCBuildConfiguration section */\n")


def settings_block(d):
    lines = []
    for k in sorted(d):
        v = d[k]
        if isinstance(v, list):
            inner = "".join(f"\t\t\t\t\t\"{x}\",\n" for x in v)
            lines.append(f"\t\t\t\t{k} = (\n{inner}\t\t\t\t);\n")
        else:
            s = str(v)
            if not s or any(c in s for c in " $()/-+=,;\"") and not s.startswith('"'):
                s = '"' + s.replace('"', '\\"') + '"'
            lines.append(f"\t\t\t\t{k} = {s};\n")
    return "".join(lines)


common = {
    "ALWAYS_SEARCH_USER_PATHS": "NO", "CLANG_ANALYZER_NONNULL": "YES", "CLANG_CXX_LANGUAGE_STANDARD": "gnu++20",
    "CLANG_ENABLE_MODULES": "YES", "CLANG_ENABLE_OBJC_ARC": "YES", "CLANG_ENABLE_OBJC_WEAK": "YES",
    "COPY_PHASE_STRIP": "NO", "ENABLE_STRICT_OBJC_MSGSEND": "YES", "GCC_C_LANGUAGE_STANDARD": "gnu17",
    "GCC_NO_COMMON_BLOCKS": "YES", "IPHONEOS_DEPLOYMENT_TARGET": DEPLOY, "SDKROOT": "iphoneos",
    "MTL_FAST_MATH": "YES",
}
proj_debug = dict(common, DEBUG_INFORMATION_FORMAT="dwarf", ENABLE_TESTABILITY="YES", GCC_OPTIMIZATION_LEVEL="0",
                  GCC_PREPROCESSOR_DEFINITIONS=["DEBUG=1", "$(inherited)"], ONLY_ACTIVE_ARCH="YES",
                  SWIFT_ACTIVE_COMPILATION_CONDITIONS="DEBUG", SWIFT_OPTIMIZATION_LEVEL="-Onone",
                  MTL_ENABLE_DEBUG_INFO="INCLUDE_SOURCE")
proj_release = dict(common, DEBUG_INFORMATION_FORMAT="dwarf-with-dsym", ENABLE_NS_ASSERTIONS="NO",
                    SWIFT_COMPILATION_MODE="wholemodule", SWIFT_OPTIMIZATION_LEVEL="-O", VALIDATE_PRODUCT="YES",
                    MTL_ENABLE_DEBUG_INFO="NO")
target = {
    "ASSETCATALOG_COMPILER_APPICON_NAME": "AppIcon",
    "ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME": "AccentColor",
    "CODE_SIGN_ENTITLEMENTS": "Lamp/Lamp.entitlements",
    "CODE_SIGN_STYLE": "Automatic",
    "CURRENT_PROJECT_VERSION": "1",
    "DEVELOPMENT_TEAM": "",
    "ENABLE_PREVIEWS": "YES",
    "GENERATE_INFOPLIST_FILE": "YES",
    "INFOPLIST_FILE": "Lamp/Info.plist",
    "INFOPLIST_KEY_CFBundleDisplayName": "Lamp",
    "INFOPLIST_KEY_LSApplicationCategoryType": "public.app-category.word-games",
    "INFOPLIST_KEY_UIApplicationSceneManifest_Generation": "YES",
    "INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents": "YES",
    "INFOPLIST_KEY_UIStatusBarStyle": "UIStatusBarStyleLightContent",
    "INFOPLIST_KEY_UISupportedInterfaceOrientations": "UIInterfaceOrientationPortrait",
    "LD_RUNPATH_SEARCH_PATHS": ["$(inherited)", "@executable_path/Frameworks"],
    "MARKETING_VERSION": "1.0",
    "PRODUCT_BUNDLE_IDENTIFIER": BUNDLE_ID,
    "PRODUCT_NAME": "$(TARGET_NAME)",
    "SUPPORTS_MACCATALYST": "NO",
    "SWIFT_EMIT_LOC_STRINGS": "YES",
    "SWIFT_VERSION": "5.0",
    "TARGETED_DEVICE_FAMILY": "1",
}
for name, d in (("Debug", proj_debug), ("Release", proj_release)):
    w(f"\t\t{uid('proj'+name)} /* {name} */ = {{\n\t\t\tisa = XCBuildConfiguration;\n\t\t\tbuildSettings = {{\n{settings_block(d)}\t\t\t}};\n\t\t\tname = {name};\n\t\t}};\n")
for name in ("Debug", "Release"):
    w(f"\t\t{uid('tgt'+name)} /* {name} */ = {{\n\t\t\tisa = XCBuildConfiguration;\n\t\t\tbuildSettings = {{\n{settings_block(target)}\t\t\t}};\n\t\t\tname = {name};\n\t\t}};\n")
w("/* End XCBuildConfiguration section */\n\n/* Begin XCConfigurationList section */\n")
for lid, pre, label in ((uid('projconfigs'), 'proj', 'PBXProject "Lamp"'), (uid('targetconfigs'), 'tgt', 'PBXNativeTarget "Lamp"')):
    w(f"\t\t{lid} /* Build configuration list for {label} */ = {{\n\t\t\tisa = XCConfigurationList;\n\t\t\tbuildConfigurations = (\n\t\t\t\t{uid(pre+'Debug')} /* Debug */,\n\t\t\t\t{uid(pre+'Release')} /* Release */,\n\t\t\t);\n\t\t\tdefaultConfigurationIsVisible = 0;\n\t\t\tdefaultConfigurationName = Release;\n\t\t}};\n")
w("/* End XCConfigurationList section */\n\t};\n\trootObject = " + uid('project') + " /* Project object */;\n}\n")

os.makedirs(os.path.join(PROJ, "xcshareddata", "xcschemes"), exist_ok=True)
open(os.path.join(PROJ, "project.pbxproj"), "w").write("".join(o))
T = uid('target')
scheme = f"""<?xml version="1.0" encoding="UTF-8"?>
<Scheme LastUpgradeVersion = "1500" version = "1.7">
   <BuildAction parallelizeBuildables = "YES" buildImplicitDependencies = "YES">
      <BuildActionEntries>
         <BuildActionEntry buildForTesting = "YES" buildForRunning = "YES" buildForProfiling = "YES" buildForArchiving = "YES" buildForAnalyzing = "YES">
            <BuildableReference BuildableIdentifier = "primary" BlueprintIdentifier = "{T}" BuildableName = "Lamp.app" BlueprintName = "Lamp" ReferencedContainer = "container:Lamp.xcodeproj">
            </BuildableReference>
         </BuildActionEntry>
      </BuildActionEntries>
   </BuildAction>
   <TestAction buildConfiguration = "Debug" selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB" shouldUseLaunchSchemeArgsEnv = "YES">
   </TestAction>
   <LaunchAction buildConfiguration = "Debug" selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB" launchStyle = "0" useCustomWorkingDirectory = "NO" ignoresPersistentStateOnLaunch = "NO" debugDocumentVersioning = "YES" debugServiceExtension = "internal" allowLocationSimulation = "YES">
      <BuildableProductRunnable runnableDebuggingMode = "0">
         <BuildableReference BuildableIdentifier = "primary" BlueprintIdentifier = "{T}" BuildableName = "Lamp.app" BlueprintName = "Lamp" ReferencedContainer = "container:Lamp.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
      <StoreKitConfigurationFileReference identifier = "../../Lamp/Lamp.storekit">
      </StoreKitConfigurationFileReference>
   </LaunchAction>
   <ProfileAction buildConfiguration = "Release" shouldUseLaunchSchemeArgsEnv = "YES" savedToolIdentifier = "" useCustomWorkingDirectory = "NO" debugDocumentVersioning = "YES">
      <BuildableProductRunnable runnableDebuggingMode = "0">
         <BuildableReference BuildableIdentifier = "primary" BlueprintIdentifier = "{T}" BuildableName = "Lamp.app" BlueprintName = "Lamp" ReferencedContainer = "container:Lamp.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </ProfileAction>
   <AnalyzeAction buildConfiguration = "Debug">
   </AnalyzeAction>
   <ArchiveAction buildConfiguration = "Release" revealArchiveInOrganizer = "YES">
   </ArchiveAction>
</Scheme>
"""
open(os.path.join(PROJ, "xcshareddata", "xcschemes", "Lamp.xcscheme"), "w").write(scheme)
print("wrote", PROJ, "with", len(swift), "Swift files")
