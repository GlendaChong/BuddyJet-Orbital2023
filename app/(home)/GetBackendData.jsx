import { supabase } from "../../lib/supabase";

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const GetMonthlyExpensesSortedByDate = async (selectedMonth, selectedYear) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  const { data } = await supabase
    .from('expenses')
    .select('*')
    .order("date", { ascending: false })
    .gte('date', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
    .lt('date', `${selectedYear}-${(monthIndex + 1).toString().padStart(2, '0')}-01`);

  return data;
};


export const GetMonthlyExpensesSortedByCat = async (selectedMonth, selectedYear) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  const { data } = await supabase
    .from('expenses')
    .select('*')
    .order("category")
    .order("date", { ascending: false })
    .gte('date', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
    .lt('date', `${selectedYear}-${(monthIndex + 1).toString().padStart(2, '0')}-01`);

  return data;
};

export const GetCurrentIncome = async () => {
  // Get existing income from backend
  let { data: budgetsArray, error: budgetError } = await supabase
    .from('budget')
    .select('income')
    .eq('in_use', true);

  if (budgetError) {
    console.error('Error fetching income', budgetError);
    return;
  }

  const currentIncome = parseInt(budgetsArray[0]?.income);

  if (budgetsArray.length == 0) {
    return 0; 
  } else {
    return currentIncome; 
  }
}; 