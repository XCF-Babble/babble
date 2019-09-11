'use strict';

import * as keystore from '../utils/keystore';
import * as cryptoutils from '../utils/cryptoutils';
import * as _ from 'bootstrap';

const refreshTable = async (): Promise<void> => {
  const tbody = document.querySelector(
    '#keystoreTable tbody'
  ) as HTMLTableElement;
  const searchBox = document.getElementById('searchBox') as HTMLInputElement;
  const search = searchBox.value as string;
  const ks = await keystore.getKeystore();
  const len = ks.length;
  const selectedEntry = await keystore.getSelectedEntry();
  while (tbody.rows.length > 0) {
    tbody.deleteRow(0);
  }
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
    var editButtonHTML: string = '';
    var deleteButtonHTML: string = '';
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
    editButtonHTML = `<button type="button" class="btn btn-info btn-sm btn-block" id="${editButtonId}"><i class="fa fa-edit"></i></button>`;
    deleteButtonId = 'deleteButton' + i.toString();
    deleteButtonHTML = `<button type="button" class="btn btn-danger btn-sm btn-block" id="${deleteButtonId}"><i class="fa fa-trash"></i></button>`;
    const row = `
    <tr>
      <td>${button}</td>
      <td>${escapeHtml(entry.name)}</td>
      <td>${escapeHtml(entry.passphrase)}</td>
      <td>${escapeHtml(truncatedBase)}</td>
      <td>${escapeHtml(tags)}</td>
      <td>${editButtonHTML}</td>
      <td>${deleteButtonHTML}</td>
    </tr>
    `;
    tbody.insertRow(i);
    tbody.rows[i].innerHTML = row;
    const id = i;

    const selectButton = document.getElementById(
      selectButtonId
    ) as HTMLButtonElement | null;
    const editButton = document.getElementById(
      editButtonId
    ) as HTMLButtonElement;
    const deleteButton = document.getElementById(
      deleteButtonId
    ) as HTMLButtonElement;

    if (selectButton) {
      selectButton.addEventListener('click', async (ev: MouseEvent) => {
        await keystore.setSelectedEntry(id);
        await refreshTable();
      });
    }
    editButton.addEventListener('click', async (ev: Event) => {
      const entryModalTitle = document.getElementById(
        'entryModalTitle'
      ) as HTMLHeadingElement;
      const editId = document.getElementById('editId') as HTMLInputElement;
      const nameBox = document.getElementById('nameBox') as HTMLInputElement;
      const passphraseBox = document.getElementById(
        'passphraseBox'
      ) as HTMLInputElement;
      const baseBox = document.getElementById('baseBox') as HTMLInputElement;
      const tagsBox = document.getElementById('tagsBox') as HTMLInputElement;

      entryModalTitle.innerText = 'Edit Entry';
      editId.value = id.toString();
      const entry = await keystore.getEntry(id);
      nameBox.value = entry.name;
      passphraseBox.value = entry.passphrase;
      baseBox.value = entry.base;
      tagsBox.value = entry.tags.join(',');

      baseBox.classList.remove('is-invalid');
      $('#entryModal').modal('show');
    });
    deleteButton.addEventListener('click', async (ev: Event) => {
      await keystore.delEntry(id);
      await refreshTable();
    });
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  await refreshTable();
  const addNewButton = document.getElementById(
    'addNewButton'
  ) as HTMLButtonElement;
  const deleteAllButton = document.getElementById(
    'deleteAllButton'
  ) as HTMLButtonElement;
  const saveButton = document.getElementById('saveButton') as HTMLButtonElement;
  const deleteAllModalButton = document.getElementById(
    'deleteAllModalButton'
  ) as HTMLButtonElement;
  const genUUIDButton = document.getElementById(
    'genUUIDButton'
  ) as HTMLButtonElement;

  const entryModalTitle = document.getElementById(
    'entryModalTitle'
  ) as HTMLHeadingElement;
  const editId = document.getElementById('editId') as HTMLInputElement;
  const nameBox = document.getElementById('nameBox') as HTMLInputElement;
  const searchBox = document.getElementById('searchBox') as HTMLInputElement;
  const passphraseBox = document.getElementById(
    'passphraseBox'
  ) as HTMLInputElement;
  const baseBox = document.getElementById('baseBox') as HTMLInputElement;
  const tagsBox = document.getElementById('tagsBox') as HTMLInputElement;

  addNewButton.addEventListener('click', (ev: Event) => {
    entryModalTitle.innerText = 'New Entry';
    editId.value = '';
    nameBox.value = '';
    passphraseBox.value == '';
    baseBox.value = cryptoutils.babbleDefaultBase;
    tagsBox.value = '';

    baseBox.classList.remove('is-invalid');
    $('#entryModal').modal('show');
  });
  deleteAllButton.addEventListener('click', (ev: Event) => {
    $('#deleteAllModal').modal('show');
  });
  deleteAllModalButton.addEventListener('click', async (ev: Event) => {
    await keystore.clearKeystore();
    await refreshTable();
    $('#deleteAllModal').modal('hide');
  });
  saveButton.addEventListener('click', async (ev: Event) => {
    const edit = editId.value;
    const name = nameBox.value;
    const passphrase = passphraseBox.value;
    const base = baseBox.value;
    var tags = (tagsBox.value || '').split(',');
    if (tags.length === 1 && tags[0] === '') {
      tags = [];
    }
    const tagsLen = tags.length;
    for (var i = 0; i < tagsLen; ++i) {
      tags[i] = tags[i].trim();
    }
    if (!isValidBase(base as string)) {
      baseBox.classList.add('is-invalid');
      return;
    }
    saveButton.disabled = true; // spammy clickers can't create multiple keys
    if (edit === '') {
      await keystore.addEntry(
        name as string,
        passphrase as string,
        base as string,
        tags
      );
    } else {
      await keystore.editEntry(
        Number.parseInt(edit as string),
        name as string,
        passphrase as string,
        base as string,
        tags
      );
    }
    $('#entryModal').modal('hide');
    await refreshTable();
    saveButton.disabled = false;
  });
  searchBox.addEventListener('keyup', refreshTable);
  genUUIDButton.addEventListener('click', async (ev: Event) => {
    passphraseBox.value = await cryptoutils.genUUID();
  });
  // TODO: Find this type!
  const entryModalOnEnter = (event: any) => {
    if (event.keyCode == 10 || event.keyCode == 13) {
      saveButton.click();
    }
  };
  nameBox.addEventListener('keydown', entryModalOnEnter);
  passphraseBox.addEventListener('keydown', entryModalOnEnter);
  baseBox.addEventListener('keydown', entryModalOnEnter);
  tagsBox.addEventListener('keydown', entryModalOnEnter);
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
