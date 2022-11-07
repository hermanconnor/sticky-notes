const initApp = () => {
  const notesContainer = document.getElementById('notes') as HTMLUListElement;
  const addNoteButton = document.getElementById('add-note')!;

  getNotes().forEach((note) => {
    const noteElement = createNoteElement(note.id, note.content);
    notesContainer.appendChild(noteElement);
  });

  notesContainer.addEventListener('change', (e) => {
    const target = e.target as HTMLTextAreaElement;
    const note = target.closest('textarea')!;

    if (!note) return;
    updateNote(note.id, note.value);
  });

  notesContainer.addEventListener('dblclick', (e) => {
    const target = e.target as HTMLTextAreaElement;
    const note = target.closest('textarea')!;

    if (!note) return;

    const doDelete = confirm('Are you sure you want to delete this note?');

    if (doDelete) {
      deleteNote(note.id, note);
    }
  });

  addNoteButton.addEventListener('click', (e) => addNote(e, notesContainer));
};

document.addEventListener('DOMContentLoaded', initApp);

interface Note {
  id: string;
  content: string;
}

// GET NOTES
const getNotes = (): Note[] => {
  return JSON.parse(localStorage.getItem('stickynotes-notes') || '[]');
};

// ADD NOTE
const addNote = (e: MouseEvent, container: HTMLUListElement) => {
  e.preventDefault();
  const notes = getNotes();

  const newNote: Note = {
    id: Math.floor(Math.random() * 100000).toString(),
    content: '',
  };

  const noteElement = createNoteElement(newNote.id, newNote.content);
  container.appendChild(noteElement);

  notes.push(newNote);
  saveNotes(notes);
};

// UPDATE NOTE
const updateNote = (id: string, newContent: string) => {
  const notes = getNotes();

  const targetNote = notes.filter((note) => note.id === id)[0];
  targetNote.content = newContent;
  saveNotes(notes);
};

// DELETE NOTE
const deleteNote = (id: string, element: HTMLTextAreaElement) => {
  const notes = getNotes().filter((note) => note.id !== id);
  saveNotes(notes);

  element.parentElement?.remove();
};

// SAVE NOTES
const saveNotes = (notes: Note[]) => {
  localStorage.setItem('stickynotes-notes', JSON.stringify(notes));
};

// CREATE NOTE ELEMENT
const createNoteElement = (id: string, content: string) => {
  const li = document.createElement('li');
  li.classList.add('py-2');

  const textarea = document.createElement('textarea');
  textarea.id = id;
  textarea.classList.add(
    'h-52',
    'w-64',
    'resize-none',
    'rounded-xl',
    'border-0',
    'px-2',
    'shadow-lg',
    'outline-none',
    'transition',
    'duration-300',
    'ease-in-out',
    'hover:shadow-xl',
    'focus:border',
    'focus:border-solid',
    'focus:border-fuchsia-600',
    'focus:shadow-xl',
    'focus:ring-2',
    'focus:ring-fuchsia-600',
  );
  textarea.placeholder = 'Empty Sticky Note';
  textarea.textContent = content;

  li.appendChild(textarea);

  return li;
};
