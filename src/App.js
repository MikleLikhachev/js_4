import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  TextField,
  Button,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import Collapse from '@material-ui/core/Collapse';


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1500,
    margin: 'auto',
    textAlign: 'center',
  },
  heading: {
    margin: theme.spacing(2),
  },
  list: {
    backgroundColor: theme.palette.background.paper,
  },
}));

function CardList() {
  const classes = useStyles();
  const [cards, setCards] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState("");
  const [editingTodoDescription, setEditingTodoDescription] = useState("");
  const [editingTodoCompleted, setEditingTodoCompleted] = useState("");
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3100/api/todos");
      setCards(response.data.todo.reverse());
    }
    fetchData();
  }, []);

  const updateTodoList = () => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3100/api/todos");
      setCards(response.data.todo.reverse());
    }
    fetchData();
  }

  const handleAddTodo = async e => {
    e.preventDefault();
    await axios.post('http://localhost:3100/api/todos', {
      id: e.id,
      title: newTodoTitle,
      description: newTodoDescription,
      isDone: false
    })
        .then(response => {
          setCards(prevCards => [...prevCards, response.data]);
          setNewTodoTitle('');
          setNewTodoDescription('')
          updateTodoList();
        })
        .catch(error => console.log(error));
  };

  function handleToggle(id) {
    if (editingTodoId === id) {
      setEditingTodoId(null);
      setEditingTodoTitle("");
      setEditingTodoDescription("");
    } else {
      setEditingTodoId(id);
      const todo = cards.find((card) => card.id === id);
      setEditingTodoTitle(todo.title);
      setEditingTodoDescription(todo.description);
    }
  }

  const handleToggleComplete = async (id, completed) => {
    await axios.patch(`http://localhost:3100/api/todos/${id}`, {
      isDone: completed
    })
        .then(response => {
          const updatedTodo = response.data;
          setCards(cards.map(card => {
            if (card.id === updatedTodo.id) {
              return updatedTodo;
            } else {
              return card;
            }
          }));
          updateTodoList();
        })
        .catch(error => console.log(error))
  }

  const handleUpdateTodo = async () => {
    await axios.patch(`http://localhost:3100/api/todos/${editingTodoId}`, {
      title: editingTodoTitle,
      description: editingTodoDescription,
    })
        .then(response => {
          const updatedTodo = response.data;
          setCards(cards.map(card => {
            if (card.id === updatedTodo.id) {
              return updatedTodo;
            } else {
              return card;
            }
          }));
          setEditingTodoId(null);
          setEditingTodoTitle("");
          setEditingTodoDescription("");
          updateTodoList()
        })
        .catch(error => console.log(error));
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3100/api/todos/${id}`)
        .then(response => {
          setCards(cards.filter(card => card.id !== id))
          updateTodoList()
        })
        .catch(error => console.log(error));
  };

  const handleDeleteAll = async () => {
    await axios.delete('http://localhost:3100/api/todos')
        .then(response => {
          setCards([])
          updateTodoList()
        })
        .catch(error => console.log(error));
  };

  return (
      <div className={classes.root}>
        <h1 className={classes.heading}>TODOшки</h1>
        <form onSubmit={handleAddTodo} className={classes.form}>
          <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginRight: "10px", marginTop: "10px"}}
          >
            Add
          </Button>
          <TextField
              label="New Todo"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
          />
          <TextField
              label="Description"
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              style={{ marginLeft: '30px' }}
          />
          <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={handleDeleteAll}
              style={{ marginLeft: "10px", marginTop: "10px"}}
          >
            Delete All
          </Button>
        </form>
        <List className={classes.list} style={{ maxWidth: "600px", marginLeft: "370px" }}>
          {cards.map((card) => (
              <React.Fragment key={card.id}>
                <ListItem key={card.id} dense button>
                  <Checkbox
                      checked={card.isDone}
                      disableRipple
                      onClick={(e) => handleToggleComplete(card.id, e.target.checked)}
                  />
                  {editingTodoId === card.id ? (
                      <>
                        <ListItemText primary={
                          <TextField
                              value={editingTodoTitle}
                              onChange={(e) => setEditingTodoTitle(e.target.value)}
                          />
                        } secondary={
                          <TextField
                              value={editingTodoDescription}
                              onChange={(e) => setEditingTodoDescription(e.target.value)}
                          />
                        } />
                        <ListItemSecondaryAction>
                          <Button
                              variant="contained"
                              color="primary"
                              onClick={handleUpdateTodo}
                          >
                            Update
                          </Button>
                        </ListItemSecondaryAction>
                      </>
                  ) : (
                      <>
                        <ListItemText primary={card.title} secondary={card.description} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="edit" onClick={() => handleToggle(card.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(card.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </>
                  )}
                </ListItem>
              </React.Fragment>
          ))}
        </List>
      </div>
  );
}

export default CardList;