// import { GetMonthlyExpensesSortedByCat, GetMonthlyExpensesSortedByDate, GetCurrentFixedIncome } from '../app/(home)/GetBackendData';
// import { supabase } from '../lib/supabase';

// jest.mock('../lib/supabase', () => ({
//   supabase: {
//     from: jest.fn(() => ({
//       select: jest.fn().mockReturnThis(),
//       order: jest.fn().mockReturnThis(),
//       gte: jest.fn().mockReturnThis(),
//       lt: jest.fn().mockReturnThis(),
//       then: jest.fn().mockImplementation(() => Promise.resolve({ data: [] })), // Default mock for no expenses
//     })),
//   },
// }));

// // Mock the GetBackendData module
// jest.mock('../app/(home)/GetBackendData', () => ({
//   GetMonthlyExpensesSortedByCat: jest.fn(),
//   GetMonthlyExpensesSortedByDate: jest.fn(),
//   GetCurrentFixedIncome: jest.fn(),
// }));

// describe('GetMonthlyExpensesSortedByDate', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('returns empty array when no expenses exist for the given month and year', async () => {
//     const selectedMonth = 'July';
//     const selectedYear = 2023;

//     const result = await GetMonthlyExpensesSortedByDate(selectedMonth, selectedYear);

//     console.log(result);

//     expect(supabase.from).toHaveBeenCalledWith('expenses'); // Add parentheses after supabase.from
//     expect(supabase.from().select).toHaveBeenCalledWith('*');
//     expect(supabase.from().select().order).toHaveBeenCalledWith('date', { ascending: false });
//     expect(supabase.from().select().order().gte).toHaveBeenCalledWith('date', '2023-07-01');
//     expect(supabase.from().select().order().gte().lt).toHaveBeenCalledWith('date', '2023-08-01');
//     expect(result).toEqual([]);
//   });

//   it('returns expenses sorted by date for the given month and year', async () => {
//     const selectedMonth = 'July';
//     const selectedYear = 2023;

//     const sampleExpenses = [
//       { id: 1, description: 'Expense 1', date: '2023-07-02', amount: 100 },
//       { id: 2, description: 'Expense 2', date: '2023-07-03', amount: 200 },
//       { id: 3, description: 'Expense 3', date: '2023-07-01', amount: 150 },
//     ];

//     // Mock the supabase module to return the sample expenses
//     supabase.from.mockReturnValueOnce({
//       select: jest.fn().mockReturnThis(),
//       order: jest.fn().mockReturnThis(),
//       gte: jest.fn().mockReturnThis(),
//       lt: jest.fn().mockReturnThis(),
//       then: jest.fn().mockResolvedValueOnce({ data: sampleExpenses }),
//     });

//     const result = await GetMonthlyExpensesSortedByDate(selectedMonth, selectedYear);

//     expect(supabase.from).toHaveBeenCalledWith('expenses');
//     expect(supabase.from().select).toHaveBeenCalledWith('*');
//     expect(supabase.from().select().order).toHaveBeenCalledWith('date', { ascending: false });
//     expect(supabase.from().select().order().gte).toHaveBeenCalledWith('date', '2023-07-01');
//     expect(supabase.from().select().order().gte().lt).toHaveBeenCalledWith('date', '2023-08-01');
//     expect(result).toEqual(sampleExpenses);
//   });
// });
