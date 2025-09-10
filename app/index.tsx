import React from "react";
import { Button, Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

import * as crypto from "expo-crypto";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type uuid = string;

type TodoItem = { id: uuid; value: string; done: boolean };
type FilterType = "all" | "done" | "notdone";

function FilterTodos({ todos, filter, toggleTodo }: { todos: TodoItem[]; filter: FilterType; toggleTodo: (id: uuid) => void }) {
  let filteredTodos = todos;
  if (filter === "done") {
    filteredTodos = todos.filter(todo => todo.done);
  } else if (filter === "notdone") {
    filteredTodos = todos.filter(todo => !todo.done);
  }

  return (
    <FlatList
      style={styles.list}
      data={filteredTodos}
      renderItem={({ item }) => <ListItem todoItem={item} toggleTodo={toggleTodo} />}
    />
  );
}

function ButtonFilterTodos({ currentFilter, setCurrentFilter }: { currentFilter: FilterType; setCurrentFilter: (f: FilterType) => void }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 20 }}>
      <Text
        style={[styles.filterButton, currentFilter === "all" ? styles.filterButtonActive : styles.filterButtonInactive]}
        onPress={() => setCurrentFilter("all")}
      >
        Todos
      </Text>
      <Text
        style={[styles.filterButton, currentFilter === "done" ? styles.filterButtonActive : styles.filterButtonInactive]}
        onPress={() => setCurrentFilter("done")}
      >
        Concluídos
      </Text>
      <Text
        style={[styles.filterButton, currentFilter === "notdone" ? styles.filterButtonActive : styles.filterButtonInactive]}
        onPress={() => setCurrentFilter("notdone")}
      >
        Pendentes
      </Text>
    </View>
  );
}

function ListItem({ todoItem, toggleTodo }: { todoItem: TodoItem; toggleTodo: (id: uuid) => void }) {

  const handlePress = (id: uuid) => {
    console.log(`Todo item with id ${id} marked as complete.`);
    toggleTodo(id);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      {!todoItem.done ? (
        <>
          <Text style={styles.item}>{todoItem.value}</Text>
          <Button title="Concluir" onPress={() => {handlePress(todoItem.id)}} color="green" />
        </>
      ) : (
        <Text style={styles.itemdone}>{todoItem.value}</Text>
      )}
    </View>
  );
}

function AddTodoForm({ addTodoHandler }: { addTodoHandler: (text: string) => void }) {
  const [text, setText] = React.useState("");

  const handlePress = () => {
    if(text.trim().length === 0) return;
    
    addTodoHandler(text);
    setText("");
    Keyboard.dismiss();
  };

  return (
    <View style={{ width: "100%", marginTop: 10, paddingHorizontal: 20, alignItems: "center" }}>
      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.textInput}
        placeholder="O que você precisa fazer?"
        placeholderTextColor="#000"
        onSubmitEditing={handlePress}
        returnKeyType="done"
      />
    </View>
  );
}


export default function Index() {
  const [todos, setTodos] = React.useState<TodoItem[]>([
    { id: crypto.randomUUID(), value: "Sample Todo", done: false },
    { id: crypto.randomUUID(), value: "Sample Todo 2", done: true },
    { id: crypto.randomUUID(), value: "Sample Todo 3", done: false },
  ]);
  const [filter, setFilter] = React.useState<FilterType>("all");

  const addTodo = (text: string) => {
    setTodos([...todos, { id: crypto.randomUUID(), value: text, done: false }]);
  };

  const toggleTodo = (id: uuid) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <GestureHandlerRootView style={styles.container}>
          <Text style={{ fontSize: 32, fontWeight: "bold", marginTop: 20 }}>
            TODO List
          </Text>
          <ButtonFilterTodos currentFilter={filter} setCurrentFilter={setFilter} />
          <AddTodoForm addTodoHandler={addTodo} />
          <FilterTodos todos={todos} filter={filter} toggleTodo={toggleTodo} />
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  textInput: {
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 50,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  itemdone: {
    padding: 10,
    fontSize: 18,
    height: 44,
    textDecorationLine: "line-through",
  },
  list: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    marginTop: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1
  },
  filterButtonActive: {
    backgroundColor: "blue",
    color: "white",
    borderColor: "blue",
  },
  filterButtonInactive: {
    backgroundColor: "white",
    color: "gray",
    borderColor: "gray",
  },
});


