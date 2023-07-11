import { useState } from 'react';
import { View, Button, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MonthYearPicker = ({ onSelect }) => {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [showPicker, setShowPicker] = useState(false);

    const handlePickerOpen = () => {
        setShowPicker(true);
    };

    const handlePickerClose = () => {
        setShowPicker(false);
    };

    const handleDateSelect = () => {
        // Do something with the selected month and year values
        console.log('Selected Month:', selectedMonth);
        console.log('Selected Year:', selectedYear);
        onSelect(selectedMonth, selectedYear);
        setShowPicker(false);
    };

    const generateMonthOptions = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months.map((month) => <Picker.Item key={month} label={month} value={month} />);
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 2;
        const endYear = currentYear + 2;
        const years = [];

        for (let year = startYear; year <= endYear; year++) {
        years.push(year.toString());
        }

        return years.map((year) => <Picker.Item key={year} label={year} value={year} />);
    };

    return (
        <View style={styles.container}>
            <Button 
                title={`${selectedMonth} ${selectedYear}`} 
                onPress={handlePickerOpen} 
                color='#171328'
            />
            <Modal visible={showPicker} animationType="slide" >
                <View style={styles.modalContainer}>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={selectedMonth}
                            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                            style={styles.pickerItem}
                        >
                        {generateMonthOptions()}
                        </Picker>
                        <Picker
                            selectedValue={selectedYear}
                            onValueChange={(itemValue) => setSelectedYear(itemValue)}
                            style={styles.pickerItem}
                        >
                        {generateYearOptions()}
                        </Picker>
                    </View>
                    <View style={styles.pickerHeader}>
                        <Button title="Select" onPress={handleDateSelect} />
                        <Button title="Cancel" onPress={handlePickerClose} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF5FF', 
    borderRadius: 20, 
    width: 200, 
    marginLeft: 80, 
    shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5, 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'center', 
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row', 
  },
  pickerItem: {
    height: 200,
    width: '50%', 
  },
});

export default MonthYearPicker;