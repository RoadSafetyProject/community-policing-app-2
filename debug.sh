cordova build --release android
cd platforms/android/build/outputs/apk/
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/development/keys/iroadcommunity.keystore android-release-unsigned.apk alias_name
rm communitypolicing.apk
zipalign -v 4 android-release-unsigned.apk communitypolicing.apk
