'use strict';

import * as keystore from '../utils/keystore';
import * as cryptoutils from '../utils/cryptoutils';
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
    var button: string = '';
    var truncatedBase: string = '';
    var tags: string = '';
    var editButton: string = '';
    var deleteButton: string = '';
    var selectButtonId: string = '';
    var deleteButtonId: string = '';

    if (i == selectedEntry) {
      button = '<i class="fa fa-check"></i>';
    } else {
      selectButtonId = 'selectButton' + i.toString();
      button = `<button type="button" class="btn btn-primary btn-sm btn-block" id="${selectButtonId}"><i class="fa fa-check"></i></button>`;
    }
    truncatedBase = entry.base.substr(0, 10) + '...';
    tags = entry.tags.join(', ');
    const editButtonId = 'editButton' + i.toString();
    editButton = `<button type="button" class="btn btn-info btn-sm btn-block" id="${editButtonId}"><i class="fa fa-edit"></i></button>`;
    deleteButtonId = 'deleteButton' + i.toString();
    deleteButton = `<button type="button" class="btn btn-danger btn-sm btn-block" id="${deleteButtonId}"><i class="fa fa-trash"></i></button>`;
    const row = `
    <tr>
      <td>${button}</td>
      <td>${escapeHtml(entry.name)}</td>
      <td>${escapeHtml(entry.passphrase)}</td>
      <td>${escapeHtml(truncatedBase)}</td>
      <td>${escapeHtml(tags)}</td>
      <td>${editButton}</td>
      <td>${deleteButton}</td>
    </tr>
    `;
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

      $('#baseBox').removeClass('is-invalid');
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

    $('#baseBox').removeClass('is-invalid');
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
    if (!isValidBase(base as string)) {
      $('#baseBox').addClass('is-invalid');
      return;
    }
    $('#saveButton').prop('disabled', true); // spammy clickers can't create multiple keys
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
    $('#saveButton').prop('disabled', false);
  });
  $('#searchBox').keyup(refreshTable);
  $('#genUUIDButton').click(async () => {
    const uuid: string = await cryptoutils.genUUID();
    $('#passphraseBox').val(uuid);
  });
  // TODO: Find this type!
  const entryModalOnEnter = (event: any) => {
    if (event.keyCode == 10 || event.keyCode == 13) {
      $('#saveButton').click();
    }
  };
  $('#nameBox').keydown(entryModalOnEnter);
  $('#passphraseBox').keydown(entryModalOnEnter);
  $('#baseBox').keydown(entryModalOnEnter);
  $('#tagsBox').keydown(entryModalOnEnter);
});

// Taken from mustache.js templating library
// https://github.com/janl/mustache.js/blob/6c3608bfb9fa74684cd9e22f5bb4c097f87484ef/mustache.js#L73-L88
const entityMap: { [unsafeEntity: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

const escapeHtml = (unsafe: string): string => {
  return unsafe.replace(/[&<>"'`=\/]/g, (s: string): string => {
    return entityMap[s];
  });
};

const baseLen: number = 256;
const isValidBase = (base: string): boolean => {
  return new Set(base).size === baseLen;
};
