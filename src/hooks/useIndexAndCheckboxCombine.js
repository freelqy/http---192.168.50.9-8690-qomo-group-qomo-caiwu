import { ref } from "vue";
export const tableData = ref([
  {
    id: 1
  },
  {
    id: 2
  },
  {
    id: 3
  }
]);

export const handleCellMouseEnter = row => {
  row.rowType = "checkbox";
};

export const handleCellMouseLeave = row => {
  row.rowType = "index";
};

export const handleCellClick = row => {
  const currentRow = tableData.value.filter(item => item.id === row.id);
  currentRow.rowChecked = !currentRow.rowChecked;
};

export const handleChange = selection => {
  if (selection.length > 0) {
    tableData.value.forEach(item => {
      item.rowType = "checkbox";
      item.rowChecked = true;
    });
  } else {
    tableData.value.forEach(item => {
      item.rowType = "index";
      item.rowChecked = false;
    });
  }
};
