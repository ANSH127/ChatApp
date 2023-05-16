import format from 'date-fns/format';
import supabase from '../config/SupabaseClient';


const updateSeen = async (senderid) => {
  const { error } = await supabase
    .from('Users')
    .update({ last_seen: new Date().toLocaleTimeString(), last_seen_date: format(new Date(), 'yyyy-MM-dd') })
    .eq('user_id', senderid)
  if (error) {
    console.log(error);
  }
}
export default updateSeen;