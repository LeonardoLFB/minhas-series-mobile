import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import {
  createSerie,
  getSerieById,
  updateSerie,
} from '../src/database/serieRepository';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const serieId = id ? Number(id) : null;
  const editando = serieId !== null;

  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadasTexto, setTemporadasTexto] = useState('');
  const [nota, setNota] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (serieId === null) return;

    getSerieById(serieId)
      .then((serie) => {
        if (!serie) return;
        setTitulo(serie.titulo);
        setPlataforma(serie.plataforma);
        setTemporadasTexto(String(serie.temporadas));
        setNota(serie.nota);
      })
      .catch((e) => console.error(e));
  }, [serieId]);

  function escolherNota(n: number) {
    setNota(nota === n ? null : n);
  }

  async function salvar() {
    const tituloLimpo = titulo.trim();
    const plataformaLimpa = plataforma.trim();
    const temporadas = Number(temporadasTexto);

    if (!tituloLimpo || !plataformaLimpa) {
      setErro('Preencha o título e a plataforma.');
      return;
    }
    if (temporadasTexto.trim() === '' || !Number.isInteger(temporadas) || temporadas < 0) {
      setErro('Temporadas precisa ser um número inteiro igual ou maior que 0.');
      return;
    }

    setErro(null);
    setSalvando(true);

    const dados = {
      titulo: tituloLimpo,
      plataforma: plataformaLimpa,
      temporadas,
      nota,
    };

    try {
      if (serieId !== null) {
        await updateSerie(serieId, dados);
      } else {
        await createSerie(dados);
      }
      router.back();
    } catch (e) {
      console.error(e);
      setErro('Não foi possível salvar. Tente novamente.');
      setSalvando(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerClassName="p-4"
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ title: editando ? 'Editar série' : 'Nova série' }} />

      <Text className="mb-1 font-semibold text-gray-700">Título</Text>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex.: Dark"
        className="mb-4 rounded-lg border border-gray-300 bg-white px-3 py-3 text-base"
      />

      <Text className="mb-1 font-semibold text-gray-700">Plataforma</Text>
      <TextInput
        value={plataforma}
        onChangeText={setPlataforma}
        placeholder="Ex.: Netflix"
        className="mb-4 rounded-lg border border-gray-300 bg-white px-3 py-3 text-base"
      />

      <Text className="mb-1 font-semibold text-gray-700">Temporadas assistidas</Text>
      <TextInput
        value={temporadasTexto}
        onChangeText={setTemporadasTexto}
        placeholder="Ex.: 2"
        keyboardType="numeric"
        className="mb-4 rounded-lg border border-gray-300 bg-white px-3 py-3 text-base"
      />

      <Text className="mb-1 font-semibold text-gray-700">Nota</Text>
      <View className="mb-1 flex-row gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => escolherNota(n)} className="p-1">
            <Text className="text-4xl text-amber-500">
              {nota !== null && n <= nota ? '★' : '☆'}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text className="mb-6 text-sm text-gray-500">
        {nota === null ? 'Sem nota' : `${nota} de 5 — toque de novo para remover`}
      </Text>

      {erro && <Text className="mb-4 font-semibold text-red-600">{erro}</Text>}

      <Pressable
        onPress={salvar}
        disabled={salvando}
        className={`rounded-xl py-4 ${salvando ? 'bg-indigo-300' : 'bg-indigo-600'}`}
      >
        <Text className="text-center text-base font-bold text-white">
          {salvando ? 'Salvando...' : 'Salvar'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}