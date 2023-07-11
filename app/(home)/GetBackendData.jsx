import { supabase } from "../../lib/supabase";

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const GetMonthlyExpensesSortedByDate = async (selectedMonth, selectedYear) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  let endYear = selectedYear;
  let endMonth = monthIndex + 1;

  // Adjust the end year and month if it goes beyond December
  if (endMonth > 12) {
    endYear++;
    endMonth = 1;
  }

  const { data } = await supabase
    .from('expenses')
    .select('*')
    .order("date", { ascending: false })
    .gte('date', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
    .lt('date', `${endYear}-${endMonth.toString().padStart(2, '0')}-01`);

  return data;
};


export const GetMonthlyExpensesSortedByCat = async (selectedMonth, selectedYear) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  let endYear = selectedYear;
  let endMonth = monthIndex + 1;

  // Adjust the end year and month if it goes beyond December
  if (endMonth > 12) {
    endYear++;
    endMonth = 1;
  }

  const { data } = await supabase
  .from('expenses')
  .select('*')
  .order("date", { ascending: false })
  .gte('date', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
  .lt('date', `${endYear}-${endMonth.toString().padStart(2, '0')}-01`);

  return data;
};


export const GetPastYearExpenses = async (selectedMonth, selectedYear) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  try {
    const expenses = [];

    // Fetch expenses for the past 6 months
    for (let i = 12; i >= 0; i--) {
      let targetYear = selectedYear;
      let targetMonth = monthIndex - i;

      // Adjust the target month and year to previous year if it goes below 1
      if (targetMonth < 1) {
        targetYear--; 
        targetMonth = 12 + targetMonth;
        
      }
      const data = await GetMonthlyExpensesSortedByDate(
        monthNames[targetMonth - 1],
        targetYear
      );
      
      expenses.push(data);
    }

    return expenses; 

  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }

}; 


export const GetPastYearExpensesSum = async (selectedMonth, selectedYear) => {
  try {
    const monthlyExpensesSum = [];
    const expenses = await GetPastYearExpenses(selectedMonth, selectedYear); 

    for (let i = 0; i < 13; i++) {
      const totalExpenses = expenses[i]?.reduce((sum, expense) => sum + expense.amount, 0);
      monthlyExpensesSum.push(totalExpenses);
    }

    return monthlyExpensesSum;

  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}; 


export const CheckMonthlyBudgetExist = async(selectedMonth, selectedYear) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  let endYear = selectedYear;
  let endMonth = monthIndex + 1;

  // Adjust the end year and month if it goes beyond December
  if (endMonth > 12) {
    endYear++;
    endMonth = 1;
  }
  
  let { data: budget, error } = await supabase
    .from('budget')
    .select('budget_id')
    .eq('in_use', true)
    .gte('created_at', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
    .lt('created_at', `${endYear}-${endMonth.toString().padStart(2, '0')}-01`);

  const budget_id = budget[0]?.budget_id; 

  if (error) {
    console.error('Error fetching budget', error);
  }  
  
  return (budget_id != undefined); 
}; 


export const GetCurrentBudget = async (selectedMonth, selectedYear) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  let endYear = selectedYear;
  let endMonth = monthIndex + 1;

  // Adjust the end year and month if it goes beyond December
  if (endMonth > 12) {
    endYear++;
    endMonth = 1;
  }

  let { data: budgetsArray, error: budgetError } = await supabase
    .from('budget')
    .select('*')
    .eq('in_use', true)
    .gte('created_at', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
    .lt('created_at', `${endYear}-${endMonth.toString().padStart(2, '0')}-01`);


  if (budgetError) {
    console.error('Error fetching income', budgetError);
    return;
  }

  return (budgetsArray[0]);
}

export const GetCurrentFixedIncome = async (selectedMonth, selectedYear) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  let endYear = selectedYear;
  let endMonth = monthIndex + 1;

  // Adjust the end year and month if it goes beyond December
  if (endMonth > 12) {
    endYear++;
    endMonth = 1;
  }

  let { data: budgetsArray, error: budgetError } = await supabase
    .from('budget')
    .select('income')
    .eq('in_use', true)
    .gte('created_at', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
    .lt('created_at', `${endYear}-${endMonth.toString().padStart(2, '0')}-01`);


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


export const GetCategoryDetails = async(selectedMonth, selectedYear) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  let endYear = selectedYear;
  let endMonth = monthIndex + 1;

  // Adjust the end year and month if it goes beyond December
  if (endMonth > 12) {
    endYear++;
    endMonth = 1;
  }

  try {
    let {data: categoryData} = await supabase
    .from('categories')
    .select('*')
    .eq('in_use', true)
    .gte('created_at', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
    .lt('created_at', `${endYear}-${endMonth.toString().padStart(2, '0')}-01`);

    return categoryData; 

  } catch (error) {
    console.error('Error fetching category details:', error);
    return [];
  }
}; 

export const GetSideHustles = async(selectedMonth, selectedYear) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  let endYear = selectedYear;
  let endMonth = monthIndex + 1;

  // Adjust the end year and month if it goes beyond December
  if (endMonth > 12) {
    endYear++;
    endMonth = 1;
  }

  try {
    const { data: sideHustles } = await supabase
      .from('moneyIn')
      .select('name, amount')
      .gte('created_at', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
      .lt('created_at', `${endYear}-${endMonth.toString().padStart(2, '0')}-01`);

    
    return sideHustles; 

  } catch (error) {
    console.log('Error fetching side hustles:', error.message);
    return; 
  }
}; 


export const GetMoneyIn = async (selectedMonth, selectedYear) => {
  try {
    const monthIndex = monthNames.indexOf(selectedMonth) + 1;

    let { data: moneyIn } = await supabase
        .from('moneyIn')
        .select('*')
        .order("created_at", { ascending: false })
        .gte('created_at', `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-01`)
        .lt('created_at', `${selectedYear}-${(monthIndex + 1).toString().padStart(2, '0')}-01`);

    let fixedIncome = await GetCurrentFixedIncome(selectedMonth, selectedYear); 

    let sideHustlesIncome = 0; 

    if (moneyIn == null) {
      return fixedIncome;
    } else {
      sideHustlesIncome = parseInt(moneyIn.reduce((sum, item) => sum + item.amount, 0));
      const total = sideHustlesIncome + parseInt(fixedIncome); 
      return total; 
    }

  } catch (error) {
    console.error('Error fetching money in data', error);
    return; 
  }
};


export const GetPastYearMoneyIn = async (selectedMonth, selectedYear, fixedIncome) => {
  const monthIndex = monthNames.indexOf(selectedMonth) + 1;

  try {
    const moneyIn = [];

    // Fetch expenses for the past 6 months
    for (let i = 12; i >= 0; i--) {
      let targetYear = selectedYear;
      let targetMonth = monthIndex - i;

      // Adjust the target month and year to previous year if it goes below 1
      if (targetMonth < 1) {
        targetYear--; 
        targetMonth = 12 + targetMonth;
        
      }

      const data = await GetMoneyIn(selectedMonth, selectedYear, fixedIncome); 
      moneyIn.push(data);
    }

    return moneyIn; 

  } catch (error) {
    console.error('Error fetching money in :', error);
    return [];
  }
}; 


export const GetPastYearMoneyInSum = async (selectedMonth, selectedYear, fixedIncome) => {
  try {
    const monthlyMoneyInSum = [];
    const moneyIn = await GetPastYearMoneyIn(selectedMonth, selectedYear, fixedIncome); 

    for (let i = 0; i < 13; i++) {
      const totalMoneyIn = moneyIn[i]?.reduce((sum, expense) => sum + expense.amount, 0);
      monthlyMoneyInSum.push(totalMoneyIn);
    }

    return monthlyMoneyInSum;

  } catch (error) {
    console.error('Error fetching money in sum:', error);
    return [];
  }
}; 


export const GetUserId = async () => {
  try {
    let { data: profiles } = await supabase
      .from('profiles')
      .select('id'); 

    const UserID = profiles[0]?.id;
    return UserID; 

  } catch (error) {
    console.error('Error fetching userId', error);
    return; 
  }
};
