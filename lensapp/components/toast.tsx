import { Text, View } from "react-native";

export function ToastComponent(title: string, description: string) {
  return (
    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}}>
      <View style={{ backgroundColor: "#121315", padding: 6, borderRadius: 64, marginTop: 48, maxWidth: 248, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white", padding: 12, paddingHorizontal: 16 }}>{description}</Text>
      </View>
    </View>
  )
}