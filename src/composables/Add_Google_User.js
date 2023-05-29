
import supabase from '../config/SupabaseClient';

const fetchGUser = async (id,username) => {
    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('user_id', id)
    if (error) {
        console.log(error);
    }
    if (data.length === 0) {
        insertGUser(id,username);
    }

}



const insertGUser = async (id,username) => {

    const { error } = await supabase
        .from('Users')
        .insert({ user_id: id, username: username})
    if (error) {
        console.log(error);
    }
    
}
export default fetchGUser;
