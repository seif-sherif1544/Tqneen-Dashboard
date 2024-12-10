import XLSX from "xlsx-js-style";

export function convertJsonToExcel(
  data = {},
  fileName = "",
  colorHeader = "246C66",
  colorRow = "babfc7"
) {
  const workSheet = XLSX.utils.json_to_sheet(data, { origin: "A1", skipHeader: false });
  const workBook = XLSX.utils.book_new();

  const bucket = JSON.parse(
    JSON.stringify(new Array(Object?.keys(data[0] ?? {}).length).fill([]))
  );

  for (let i in data) {
    for (let j in bucket) {
      bucket[j].push(Object.values(data[i])[j]);
    }
  }

  // let maxLengthes = bucket.map(arr => ({"wch" : Math.max(...arr?.map(el => el?.toString().length))}))

  workSheet["!cols"] = [];
  workSheet["!rows"] = [];
  for (var i in workSheet) {
    if (typeof workSheet[i] != "object") continue;
    let cell = XLSX.utils.decode_cell(i);
    workSheet["!cols"].push({ wch: 30 });
    workSheet["!rows"].push({ hpx: 30 });
    workSheet[i].s = {
      // styling for all cells
      alignment: {
        vertical: "center",
        horizontal: "center",
        wrapText: false, // any truthy value here
      },
      border: {
        top: { style: "thin", color: { rgb: "black" } },
        bottom: { style: "thin", color: { rgb: "black" } },
        left: { style: "thin", color: { rgb: "black" } },
        right: { style: "thin", color: { rgb: "black" } },
      },
    };
    if (cell.r == 0) {
      // first row
      workSheet[i].s.fill = {
        // background color
        patternType: "solid",
        fgColor: { rgb: colorHeader },
        bgColor: { rgb: colorHeader },
      };
      workSheet[i].s.font = {
        color: { rgb: "ffffff" },
        sz: "12",
        bold: true,
      };
    }

    // check cell is an even number
    if (cell.r != 0 && cell.r % 2 == 0) {
      // first row
      workSheet[i].s.fill = {
        // background color
        patternType: "solid",
        fgColor: { rgb: colorRow },
        bgColor: { rgb: colorRow },
      };
      workSheet[i].s.font = {
        color: { rgb: "ffffff" },
        sz: "12",
        bold: true,
      };
    }

    // const result = (cell.r % 2  == 0) ? "even" : "odd";
  }

  // workSheet["!cols"]?.push(...maxLengthes)

  XLSX.utils.book_append_sheet(workBook, workSheet, fileName);

  // Generate buffer
  XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

  // Binary string
  XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
  const theFile = XLSX.writeFile(workBook, `${fileName}.xlsx`);

  return theFile;
}
