import { useCallback, useState } from 'react';
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  deleteSerie,
  getSerieById,
  toggleSerieConcluida,
} from '../src/database/serieRepository';
import type { Serie } from '../src/types/serie';

export default function DetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const serieId = Number(id);

  const [serie, setSerie] = useState<Serie | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      const encontrada = await getSerieById(serieId);
      setSerie(encontrada);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, [serieId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function alternarConcluida() {
    try {
      await toggleSerieConcluida(serieId);
      await carregar();
    } catch (e) {
      console.error(e);
    }
  }

  function confirmarExclusao() {
    if (!serie) return;

    Alert.alert(
      'Excluir série',
      `Tem certeza que deseja excluir "${serie.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSerie(serieId);
              router.back();
            } catch (e) {
              console.error(e);
            }
          },
        },
      ]
    );
  }

  if (carregando) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-500">Carregando...</Text>
      </View>
    );
  }

  if (!serie) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-500">Série não encontrada.</Text>
      </View>
    );
  }

  const concluida = serie.concluida === 1;

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerClassName="p-4">
      <View className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <Text className="text-2xl font-bold text-gray-900">{serie.titulo}</Text>

        <View
          className={`mt-2 self-start rounded-full px-3 py-1 ${
            concluida ? 'bg-green-100' : 'bg-indigo-100'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              concluida ? 'text-green-700' : 'text-indigo-700'
            }`}
          >
            {concluida ? '✓ Concluída' : '▶ Assistindo'}
          </Text>
        </View>

        <View className="mt-5 gap-3">
          <View>
            <Text className="text-sm text-gray-500">Plataforma</Text>
            <Text className="text-base text-gray-900">{serie.plataforma}</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Temporadas assistidas</Text>
            <Text className="text-base text-gray-900">{serie.temporadas}</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Nota</Text>
            <Text className="text-base text-amber-600">
              {serie.nota !== null ? '★'.repeat(serie.nota) : 'Sem nota'}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Cadastrada em</Text>
            <Text className="text-base text-gray-900">
              {new Date(serie.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={alternarConcluida}
        className={`mb-3 rounded-xl py-4 ${concluida ? 'bg-gray-500' : 'bg-green-600'}`}
      >
        <Text className="text-center text-base font-bold text-white">
          {concluida ? 'Voltar para assistindo' : 'Marcar como concluída'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push(`/form?id=${serie.id}`)}
        className="mb-3 rounded-xl border-2 border-indigo-600 py-4"
      >
        <Text className="text-center text-base font-bold text-indigo-600">Editar</Text>
      </Pressable>

      <Pressable onPress={confirmarExclusao} className="rounded-xl bg-red-600 py-4">
        <Text className="text-center text-base font-bold text-white">Excluir</Text>
      </Pressable>
    </ScrollView>
  );
}