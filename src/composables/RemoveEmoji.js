
import supabase from '../config/SupabaseClient';

const RemoveEmoji = async(id) => {
    console.log(id);
    const {error } = await  supabase
        .from('messages')
        .update({ reaction_emoji: null })
        .eq('id', id)
    if (error) {
        console.log(error);
        return;
    }
    console.log('Emoji Removed');
    
        

}

export default RemoveEmoji;