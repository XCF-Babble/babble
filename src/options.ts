'use strict';

import * as keystore from './keystore';
import * as cryptoutils from './cryptoutils';
import * as _ from 'bootstrap';

const refreshTable = async (): Promise<void> => {
  const tbody = $('#keystoreTable tbody');
  const search = $('#searchBox').val() as string;
  const ks = await keystore.getKeystore();
  const len = ks.length;
  const selectedEntry = await keystore.getSelectedEntry();
  tbody.empty();
  for (var i = 0; i < len; ++i) {
    const entry = ks[i];
    if (entry.name.indexOf(search) == -1) {
      var ok: boolean = false;
      for (const tag of entry.tags) {
        if (tag.indexOf(search) != -1) {
          ok = true;
          break;
        }
      }
      if (!ok) {
        continue;
      }
    }
    var row: string = '';
    row += '<tr>';
    row += '<td>';
    var selectButtonId = '';
    if (i == selectedEntry) {
      row += 'Selected';
    } else {
      selectButtonId = 'selectButton' + i.toString();
      row +=
        '<button type="button" class="btn btn-primary btn-sm btn-block" id="' +
        selectButtonId +
        '">Select</button>';
    }
    row += '</td>';
    row += '<td>';
    row += entry.name;
    row += '</td>';
    row += '<td>';
    row += entry.passphrase;
    row += '</td>';
    row += '<td>';
    row += entry.base.substr(0, 10) + '...';
    row += '</td>';
    row += '<td>';
    row += entry.tags.join(', ');
    row += '</td>';
    row += '<td>';
    const editButtonId = 'editButton' + i.toString();
    row +=
      '<button type="button" class="btn btn-info btn-sm btn-block" id="' +
      editButtonId +
      '">Edit</button>';
    row += '</td>';
    row += '<td>';
    const deleteButtonId = 'deleteButton' + i.toString();
    row +=
      '<button type="button" class="btn btn-danger btn-sm btn-block" id="' +
      deleteButtonId +
      '">Delete</button>';
    row += '</td>';
    row += '</tr>';
    tbody.append(row);
    const id = i;
    if (selectButtonId !== '') {
      $('#' + selectButtonId).click(async () => {
        await keystore.setSelectedEntry(id);
        await refreshTable();
      });
    }
    $('#' + editButtonId).click(async () => {
      $('#entryModalTitle').html('Edit Entry');
      $('#editId').val(id.toString());
      const entry = await keystore.getEntry(id);
      $('#nameBox').val(entry.name);
      $('#passphraseBox').val(entry.passphrase);
      $('#baseBox').val(entry.base);
      $('#tagsBox').val(entry.tags.join(','));
      $('#entryModal').modal('show');
    });
    $('#' + deleteButtonId).click(async () => {
      await keystore.delEntry(id);
      await refreshTable();
    });
  }
};

$(document).ready(async () => {
  await refreshTable();
  $('#addNewButton').click(() => {
    $('#entryModalTitle').html('New Entry');
    $('#editId').val('');
    $('#nameBox').val('');
    $('#passphraseBox').val('');
    $('#baseBox').val(cryptoutils.babbleDefaultBase);
    $('#tagsBox').val('');
    $('#entryModal').modal('show');
  });
  $('#deleteAllButton').click(async () => {
    await keystore.clearKeystore();
    await refreshTable();
  });
  $('#saveButton').click(async () => {
    const editId = $('#editId').val();
    const name = $('#nameBox').val();
    const passphrase = $('#passphraseBox').val();
    const base = $('#baseBox').val();
    var tags = ($('#tagsBox').val() as string).split(',');
    if (tags.length === 1 && tags[0] === '') {
      tags = [];
    }
    const tagsLen = tags.length;
    for (var i = 0; i < tagsLen; ++i) {
      tags[i] = tags[i].trim();
    }
    if (editId === '') {
      await keystore.addEntry(
        name as string,
        passphrase as string,
        base as string,
        tags
      );
    } else {
      await keystore.editEntry(
        Number.parseInt(editId as string),
        name as string,
        passphrase as string,
        base as string,
        tags
      );
    }
    $('#entryModal').modal('hide');
    await refreshTable();
  });
  $('#searchBox').keyup(refreshTable);
});
