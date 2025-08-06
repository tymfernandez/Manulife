import { supabase } from '../lib/supabase';

export const accountService = {
  // Get all accounts
  async getAccounts() {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create new account
  async createAccount(accountData) {
    const { data, error } = await supabase
      .from('accounts')
      .insert([accountData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Update account
  async updateAccount(id, accountData) {
    const { data, error } = await supabase
      .from('accounts')
      .update({ ...accountData, updated_at: new Date() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Delete account
  async deleteAccount(id) {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Search accounts
  async searchAccounts(searchTerm, roleFilter, statusFilter) {
    let query = supabase.from('accounts').select('*');
    
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    if (roleFilter) {
      query = query.eq('role', roleFilter);
    }
    
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};