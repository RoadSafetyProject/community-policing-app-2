cordova build --release android
cd platforms/android/build/outputs/apk/
rm android-release-SIGNED_UNALIGNED.apk
chown -R vincent:vincent ../apk/
#jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/development/keys/iroadcommunity.keystore -storepass StrongPasswordABC123 -keypass StrongPasswordABC123 android-release-unsigned.apk alias_name
#adb install -r android-release-unsigned.apk
#rm communitypolicing.apk
#zipalign -v 4 android-release-unsigned.apk communitypolicing.apk
