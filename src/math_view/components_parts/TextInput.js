import React from 'react';
import {InputGroup, FormControl} from 'react-bootstrap';
import LockButton from "../buttons/LockButton";
import TableButton from "../buttons/TableButton";
import DatabaseButton from "../buttons/DatabaseButton";

const TextInput = ({onChange, onLock, textData, label, teacherMode, id, toggleTable, toggleDatabase, arity, domain, placeholder,databaseEnabled,tableEnabled}) => (
    <InputGroup>
        <label className='input-group-addon' htmlFor={id}>{label}</label>
     <FormControl id={id}
                  type='text'
                  onChange={(e) => onChange(e)}
                  value={textData.value}
                  disabled={textData.locked}
                  placeholder={placeholder}/>
     <InputGroup.Append>&#125;</InputGroup.Append>
     {toggleTable || teacherMode ? (
        <InputGroup.Append>
          {toggleTable ? (
             (arity > 2 || domain.length === 0) ? null : (
                <TableButton onClick={() => toggleTable()} enabled={tableEnabled}/>
             )
          ) : null}
            {toggleDatabase?(
                (domain.length === 0)? null :(
                    <DatabaseButton onClick={() => toggleDatabase()} enabled={databaseEnabled}/>
                )
            ) : null}
          {teacherMode ? (
             <LockButton lockFn={() => onLock()} locked={textData.locked}/>
          ) : null}
        </InputGroup.Append>
     ) : null}
   </InputGroup>
);

export default TextInput;