import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import ACTIONS from '../actions';

const Editor = ({ settheme, socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    const defaultText = `// Boilerplate for writing C++ code

#include<bits/stdc++.h>

using namespace std;

int main(){
    //write your C++ code here

    return 0;
}`;

    useEffect(() => {
        editorRef.current = Codemirror.fromTextArea(document.getElementById('codeEditor'), {
            mode: { name: 'javascript', json: true },
            theme: settheme === 'DARK' ? 'material' : 'default',
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
        });
        editorRef.current.setValue(defaultText);
        const handleChange = (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();
            onCodeChange(code);
            console.log(code);
            console.log(socketRef.current);
            if (origin !== 'setValue' && socketRef.current) {
                console.log("changes in code");
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
        };

        editorRef.current.on('change', handleChange);

        return () => {
            if (editorRef.current) {
                editorRef.current.off('change', handleChange);
                editorRef.current.toTextArea();
            }
        };
    }, [settheme, onCodeChange, roomId, socketRef]);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                console.log(code);
                if (code !== null) {
                    const currentCursor = editorRef.current.getCursor();
                    const currentScroll = editorRef.current.getScrollInfo();

                    editorRef.current.setValue(code);
                    editorRef.current.setCursor(currentCursor.line, code.length);
                    editorRef.current.scrollTo(currentScroll.left, currentScroll.top);
                }
            });
        }


        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE);
            }
        };
    }, [socketRef.current]);

    return (
        <>
            <textarea id="codeEditor" defaultValue={defaultText}></textarea>
        </>
    );
}

export default Editor;
