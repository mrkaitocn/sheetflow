/**
 * ============================================================================
 * SHEETFLOW — HỆ THỐNG BÁO CÁO CÔNG VIỆC NHÓM TỰ ĐỘNG
 * ============================================================================
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('SheetFlow 🚀')
    .addItem('⚙️ Import Cấu hình từ Web App', 'showImportConfigDialog')
    .addItem('🔗 Xem Web App cho nhân viên', 'showWebAppUrlDialog')
    .addItem('📊 Khởi tạo lại bảng từ Cấu hình', 'setupSheetFromConfig')
    .addToUi();
}

/**
 * Dialog dán JSON cấu hình từ SheetFlow Web App
 */
function showImportConfigDialog() {
  const html = HtmlService.createHtmlOutput(
    '<h3>Dán mã cấu hình JSON từ SheetFlow Web App:</h3>' +
    '<textarea id="cfg" style="width:100%;height:220px;font-family:monospace;font-size:12px;"></textarea><br/><br/>' +
    '<button onclick="save()" style="background:#6366f1;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">Lưu & Khởi tạo Sheet</button>' +
    '<script>' +
    'function save(){' +
    '  var val = document.getElementById("cfg").value;' +
    '  google.script.run.withSuccessHandler(function(){ google.script.host.close(); }).saveConfigJSON(val);' +
    '}' +
    '</script>'
  ).setWidth(500).setHeight(340);
  SpreadsheetApp.getUi().showModalDialog(html, 'Import Cấu hình SheetFlow');
}

/**
 * Lưu JSON và thiết lập Sheet
 */
function saveConfigJSON(jsonString) {
  try {
    const config = JSON.parse(jsonString);
    PropertiesService.getScriptProperties().setProperty('SHEETFLOW_CONFIG', jsonString);
    setupSheetFromConfig();
    SpreadsheetApp.getUi().alert('✅ Đã lưu cấu hình và khởi tạo bảng thành công!');
  } catch(e) {
    SpreadsheetApp.getUi().alert('❌ Lỗi định dạng JSON: ' + e.message);
  }
}

/**
 * Hiển thị URL Web App
 */
function showWebAppUrlDialog() {
  const url = ScriptApp.getService().getUrl();
  const html = HtmlService.createHtmlOutput(
    '<p>Đây là đường dẫn Web App dành cho nhân viên báo cáo:</p>' +
    '<input type="text" value="' + url + '" readonly style="width:100%;padding:8px;font-size:13px;" onclick="this.select()"/>' +
    '<p style="font-size:12px;color:#666;margin-top:10px;">Hãy copy đường dẫn này và dán vào SheetFlow Web App hoặc gửi cho nhân viên.</p>'
  ).setWidth(450).setHeight(160);
  SpreadsheetApp.getUi().showModalDialog(html, 'Link Web App');
}

function numToColLetter(num) {
  let temp, letter = '';
  while (num > 0) {
    temp = (num - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    num = (num - temp - 1) / 26;
  }
  return letter;
}

/**
 * Tự động tạo cấu trúc Cột & Dropdown trong Sheet dựa vào Config
 */
function setupSheetFromConfig() {
  const config = getConfig();
  if (!config) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Danh sách Công việc');
  if (!sheet) {
    sheet = ss.insertSheet('Danh sách Công việc');
  }

  const startRow = config.tableStartRow || 1;

  // Set Headers
  const columns = config.columns || [];
  const headers = columns.map(c => c.label);
  sheet.getRange(startRow, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(startRow, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1e293b')
    .setFontColor('#ffffff');

  // Format Status Column Dropdown Validation & Conditional Formatting
  const statusColIndex = columns.findIndex(c => c.key === 'status');
  if (statusColIndex >= 0 && config.statusFlow && config.statusFlow.length > 0) {
    const colNumber = statusColIndex + 1; // 1-based index
    const statusLabels = config.statusFlow.map(s => s.label);
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(statusLabels, true)
      .setAllowInvalid(true)
      .build();
    sheet.getRange(startRow + 1, colNumber, 1000, 1).setDataValidation(rule);

    // Xóa Conditional Formatting cũ và thêm mới
    sheet.clearConditionalFormatRules();
    const rules = [];
    const colLetter = numToColLetter(colNumber); // VD: B, C, D...
    
    config.statusFlow.forEach(s => {
      const formatRule = SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$${colLetter}${startRow + 1}="${s.label}"`)
        .setFontColor(s.color) // Đổi màu chữ theo màu trạng thái
        .setBold(true)
        .setRanges([sheet.getRange(`${startRow + 1}:1000`)])
        .build();
      rules.push(formatRule);
    });
    sheet.setConditionalFormatRules(rules);
  }

  // Khởi tạo Sheet Lịch sử cập nhật
  let historySheet = ss.getSheetByName('Lịch sử cập nhật');
  if (!historySheet) {
    historySheet = ss.insertSheet('Lịch sử cập nhật');
    const histHeaders = ['Thời gian', 'Người cập nhật', 'Mã CV', 'Cột thay đổi', 'Giá trị cũ', 'Giá trị mới'];
    historySheet.getRange(1, 1, 1, histHeaders.length).setValues([histHeaders]);
    historySheet.getRange(1, 1, 1, histHeaders.length).setFontWeight('bold').setBackground('#f1f5f9');
  }
}

function getConfig() {
  const raw = PropertiesService.getScriptProperties().getProperty('SHEETFLOW_CONFIG');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch(e) {
    return null;
  }
}

/**
 * Web App HTTP Entry Points
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', time: new Date() }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'getData') {
    const data = getTasksData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Render Employee Web App
  const config = getConfig() || { projectName: 'SheetFlow Báo Cáo', appearance: { primaryColor: '#6366f1' } };
  const template = HtmlService.createTemplateFromFile('WebApp');
  template.config = config;
  return template.evaluate()
    .setTitle(config.projectName || 'Báo cáo công việc')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Lấy dữ liệu công việc từ Sheet
 */
function getTasksData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Danh sách Công việc');
  if (!sheet) return { tasks: [], config: getConfig() };

  const config = getConfig();
  const startRow = config.tableStartRow || 1;
  const lastRow = sheet.getLastRow();
  
  if (lastRow < startRow + 1) return { tasks: [], config: config };

  const columns = config ? config.columns : [];
  const range = sheet.getRange(startRow + 1, 1, lastRow - startRow, columns.length);
  const values = range.getValues();

  const tasks = values.map((row, idx) => {
    const taskObj = { _rowId: idx + startRow + 1 };
    columns.forEach((col, cIdx) => {
      taskObj[col.key] = row[cIdx];
    });
    return taskObj;
  });

  return { tasks: tasks, config: config };
}

/**
 * Cập nhật trạng thái, ghi chú hoặc tài liệu đính kèm từ Employee Web App
 */
function updateTaskFromApp(data) {
  const userEmail = Session.getActiveUser().getEmail() || 'Khách';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Danh sách Công việc');
  const historySheet = ss.getSheetByName('Lịch sử cập nhật');
  const config = getConfig();

  if (!sheet || !config) return { success: false, message: 'Sheet chưa được cấu hình' };

  const rowId = parseInt(data.rowId, 10);
  if (!rowId || rowId < 2) return { success: false, message: 'ID dòng không hợp lệ' };

  const columns = config.columns || [];
  
  // Get old values for logging
  const currentValues = sheet.getRange(rowId, 1, 1, columns.length).getValues()[0];
  let taskId = currentValues[columns.findIndex(c => c.key === 'task_id')] || 'Không xác định';

  // Update specified fields
  let changes = [];
  columns.forEach((col, cIdx) => {
    if (data.values && data.values.hasOwnProperty(col.key)) {
      const colNum = cIdx + 1;
      let val = data.values[col.key];

      if (Array.isArray(val)) {
        val = val.join('\n');
      }
      
      let oldVal = currentValues[cIdx];
      if (oldVal !== val) {
        sheet.getRange(rowId, colNum).setValue(val);
        changes.push({ label: col.label, old: oldVal, new: val });
        if (historySheet) {
          historySheet.appendRow([new Date(), userEmail, taskId, col.label, oldVal, val]);
        }
      }
    }
  });

  // Send Notification Email if configured
  try {
    if (changes.length > 0 && config.notifications && config.notifications.enabled && config.notifications.managerEmail) {
      const taskNameCol = columns.findIndex(c => c.key === 'task_name');
      const taskName = taskNameCol >= 0 ? currentValues[taskNameCol] : 'Công việc dòng ' + rowId;
      
      let changeText = changes.map(c => `- ${c.label}: [${c.old}] -> [${c.new}]`).join('\n');
      
      MailApp.sendEmail({
        to: config.notifications.managerEmail,
        subject: '[SheetFlow] Cập nhật công việc: ' + taskName,
        body: 'Người cập nhật: ' + userEmail + '\n\nMã CV: ' + taskId + '\n\nChi tiết thay đổi:\n' + changeText
      });
    }
  } catch(err) {
    Logger.log('Notification error: ' + err.message);
  }

  return { success: true };
}

/**
 * Thêm công việc mới từ Web App (nếu được phép)
 */
function addNewTaskFromApp(dataValues) {
  const userEmail = Session.getActiveUser().getEmail() || 'Khách';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Danh sách Công việc');
  const historySheet = ss.getSheetByName('Lịch sử cập nhật');
  const config = getConfig();

  if (!sheet || !config) return { success: false, message: 'Sheet chưa khởi tạo' };

  const columns = config.columns || [];
  const startRow = config.tableStartRow || 1;
  
  // Find highest ID to auto-increment SF-001, SF-002...
  let newId = 'SF-001';
  const idColIdx = columns.findIndex(c => c.key === 'task_id');
  if (idColIdx >= 0 && sheet.getLastRow() > startRow) {
    const idValues = sheet.getRange(startRow + 1, idColIdx + 1, sheet.getLastRow() - startRow, 1).getValues();
    let maxNum = 0;
    idValues.forEach(r => {
      const match = String(r[0]).match(/^SF-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    newId = 'SF-' + String(maxNum + 1).padStart(3, '0');
  } else {
    newId = 'SF-' + Date.now().toString().slice(-4);
  }

  const rowValues = [];
  columns.forEach(col => {
    if (col.key === 'task_id') {
      rowValues.push(newId);
    } else {
      let val = dataValues[col.key] || '';
      if (Array.isArray(val)) val = val.join('\n');
      rowValues.push(val);
    }
  });

  sheet.appendRow(rowValues);
  
  if (historySheet) {
    historySheet.appendRow([new Date(), userEmail, newId, 'Tạo mới công việc', '', '']);
  }
  
  return { success: true, taskId: newId };
}

function getOrCreateFolder(parent, folderName) {
  const folders = parent.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parent.createFolder(folderName);
}

/**
 * Tải file lên Google Drive từ Web App (nhận Base64)
 */
function uploadFilesToDrive(filesObj, taskId, taskName) {
  try {
    const rootFolderName = 'SheetFlow_Uploads';
    let rootFolder = getOrCreateFolder(DriveApp, rootFolderName);
    
    const sheetName = SpreadsheetApp.getActiveSpreadsheet().getName() || 'Dự Án Không Tên';
    let projectFolder = getOrCreateFolder(rootFolder, sheetName);
    
    const now = new Date();
    const monthFolderStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    let monthFolder = getOrCreateFolder(projectFolder, monthFolderStr);
    
    const tId = taskId || 'No-ID';
    const tName = taskName || 'Công việc không tên';
    const taskFolderName = `[${tId}] ${tName}`;
    let taskFolder = getOrCreateFolder(monthFolder, taskFolderName);
    
    let uploadedUrls = [];
    
    for (let i = 0; i < filesObj.length; i++) {
      const fileData = filesObj[i];
      const contentType = fileData.data.substring(5, fileData.data.indexOf(';'));
      const bytes = Utilities.base64Decode(fileData.data.substr(fileData.data.indexOf('base64,') + 7));
      const blob = Utilities.newBlob(bytes, contentType, fileData.name);
      
      const file = taskFolder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      uploadedUrls.push(file.getUrl());
    }
    
    return { success: true, urls: uploadedUrls };
  } catch (error) {
    Logger.log(error);
    return { success: false, message: error.message };
  }
}
