import { useState, useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Task from './Tasks';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, addDoc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function TaskList() {
    const firebaseConfig = {
        apiKey: "AIzaSyA1Xd4RVJ8lCH_drWT_itiKr-QM3H68pHo",
        authDomain: "todoapp-2907c.firebaseapp.com",
        projectId: "todoapp-2907c",
        storageBucket: "todoapp-2907c.appspot.com",
        messagingSenderId: "457231554037",
        appId: "1:457231554037:web:7d5986d4de5b9a939dbcbc"
    };

    initializeApp(firebaseConfig);

    const getData = () => {

        const firestore = getFirestore();
        const taskCollectionRef = collection(firestore, "users", "user_id", "tasks");

        const unsubscribe = onSnapshot(taskCollectionRef, (querySnapshot) => {
            const tasksData = [];
            querySnapshot.forEach((doc) => {
                tasksData.push({ id: doc.id, ...doc.data() });
            });

            setTemp(tasksData);

        });

        if (isEnabled) {
            setTasks(temp.filter(task => !task.done))
        } else {
            setTasks(temp);
        }
        return unsubscribe;

    }

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        getData();
    }

    useEffect(() => {
        getData();
    }, []);

    const [task, setTask] = useState();
    const [tasks, setTasks] = useState([]);
    const [temp, setTemp] = useState([]);

    const handleAddTask = async () => {
        Keyboard.dismiss();

        const firestore = getFirestore();

        const userDocRef = doc(firestore, "users", "user_id");
        const taskCollectionRef = collection(userDocRef, "tasks");

        try {
            await addDoc(taskCollectionRef, {
                taskName: task,
                done: false,
            });


            setTask(null);
        } catch (error) {
            console.log("Error adding document: ", error);
        }
    }

    const completeTask = async (taskId) => {
        const firestore = getFirestore();
        const taskDocRef = doc(firestore, "users", "user_id", "tasks", taskId);

        try {
            await updateDoc(taskDocRef, {
                done: true
            });
        } catch (error) {
            console.log("Error updating document: ", error);
        }
    }



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.taskWrapper}>
                <View style={styles.headerWrapper}>
                <Text style={styles.sectionTitle}>Today tasks</Text>
                <Switch
                    thumbColor={isEnabled ? 'white' : 'hotpink'}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
                </View>
                <ScrollView>

                    <View style={styles.items}>
                        {
                            tasks.map((task) =>
                                <TouchableOpacity key={task.id} onPress={() => completeTask(task.id)}>
                                    <Task text={task.taskName}></Task>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </ScrollView>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.writeTaskWrapper}>
                <TextInput style={styles.input} placeholder={'write a task'} onChangeText={text => setTask(text)} value={task}></TextInput>
                <TouchableOpacity onPress={() => handleAddTask()}>
                    <View style={styles.addWrapper}>
                        <Text style={styles.addText}>+</Text>
                    </View>
                </TouchableOpacity>

            </KeyboardAvoidingView>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightpink',
    },
    headerWrapper: {
        paddingTop: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    taskWrapper: {
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    items: {
        marginTop: 30,

    },
    writeTaskWrapper: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: 'azure',
        width: 250,
        borderRadius: 60,
        borderColor: 'black',
        borderWidth: 1,
    },
    addWrapper: {
        width: 60,
        height: 60,
        backgroundColor: 'azure',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
    },
    addText: {

    }
});