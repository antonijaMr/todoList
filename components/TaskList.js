import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';
import Task from './Tasks';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, addDoc } from 'firebase/firestore';

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



    const [task, setTask] = useState();
    const [taskItems, setTaskItems] = useState([]);


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

                // add the new task to the taskItems state
                setTaskItems([...taskItems, task]);

                // reset the task input field
                setTask(null);
            } catch (error) {
                console.log("Error adding document: ", error);
            }
        }


    const completeTask = (index) => {
        let itemsCopy = [...taskItems];
        //splice removes one item from array sa indeksom index
        itemsCopy.splice(index, 1);
        setTaskItems(itemsCopy);

    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.taskWrapper}>
                <Text style={styles.sectionTitle}>Today tasks</Text>

                <View style={styles.items}>
                    {
                        taskItems.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                                    <Task text={item}></Task>
                                </TouchableOpacity>

                            )
                        })
                    }

                    {/* tasks */}
                </View>
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