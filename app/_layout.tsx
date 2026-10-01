import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Minhas Séries' }} />
      <Stack.Screen name="form" options={{ title: 'Série' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhes' }} />
    </Stack>
  );
}