import useSupabase from "src/boot/supabase";

export default function useApi() {
  const supabase = useSupabase();
  const list = async () => {
    const { data, error } = await supabase.from("jogos_cadastrados").select();
    if (error) throw error;
    return data;
  };
  const create = async (dados) => {
    const { data, error } = await supabase
      .from("jogos_cadastrados")
      .insert({ nome: dados.nome, numeros: dados.numeros });
  };
  const update = async () => {};
  const remove = async () => {};

  return {
    list,
    create,
    update,
    remove,
  };
}
