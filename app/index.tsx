import { useCallback, useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { getSeries } from '../src/database/serieRepository';
import type { Serie, SerieFilter } from '../src/types/serie';

const FILTROS: { valor: SerieFilter; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'assistindo', rotulo: 'Assistindo' },
  { valor: 'concluidas', rotulo: 'Concluídas' },
];

export default function ListaScreen() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [filtro, setFiltro] = useState<SerieFilter>('todas');

  useFocusEffect(
    useCallback(() => {
      getSeries(filtro)
        .then(setSeries)
        .catch((erro) => console.error(erro));
    }, [filtro])
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row gap-2 p-4">
        {FILTROS.map((f) => {
          const ativo = f.valor === filtro;
          return (
            <Pressable
              key={f.valor}
              onPress={() => setFiltro(f.valor)}
              className={`flex-1 rounded-full py-2 ${
                ativo ? 'bg-indigo-600' : 'border border-gray-300 bg-white'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  ativo ? 'text-white' : 'text-gray-700'
                }`}
              >
                {f.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="px-4 pb-4"
        ListEmptyComponent={
          <Text className="mt-10 text-center text-gray-500">
            Nenhuma série por aqui ainda.
          </Text>
        }
        renderItem={({ item }) => {
          const concluida = item.concluida === 1;
          return (
            <Pressable
              onPress={() => router.push(`/detalhe?id=${item.id}`)}
              className={`mb-3 rounded-xl border p-4 ${
                concluida ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className={`flex-1 text-lg font-bold ${
                    concluida ? 'text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {item.titulo}
                </Text>
                {concluida && (
                  <Text className="text-xs font-semibold text-green-700">✓ Concluída</Text>
                )}
              </View>
              <Text className="mt-1 text-gray-600">
                {item.plataforma} · {item.temporadas}{' '}
                {item.temporadas === 1 ? 'temporada' : 'temporadas'}
              </Text>
              <Text className="mt-1 text-amber-600">
                {item.nota !== null ? '★'.repeat(item.nota) : 'Sem nota'}
              </Text>
            </Pressable>
          );
        }}
      />

      <Pressable
        onPress={() => router.push('/form')}
        className="m-4 rounded-xl bg-indigo-600 py-4"
      >
        <Text className="text-center text-base font-bold text-white">+ Nova série</Text>
      </Pressable>
    </View>
  );
}