<?php

    /**
     * Дефолтная модель
     *
     * @author  Zmi
     * @updated GYL
     */
    abstract class Model
    {
        protected $table;
        protected $db;
        private   $idField;
        private   $id;
        private   $data      = array();
        private   $dataStart = array();
        private   $readOnly  = false;

        private   $isDel = false;

        abstract protected function CreateTable();

        public function __construct($db, $table, $idField, $id = NULL, $readOnly = false)
        {
            $this->db       = $db;
            $this->table    = $table;
            $this->idField  = $idField;
            $this->id       = $id;
            $this->readOnly = $readOnly;

            if (!$readOnly)
            {
                $this->CreateTable();
            }

            if ($this->id)
            {
                $this->data = $this->db->selectRow("SELECT
                                                        *
                                                    FROM
                                                        ?#
                                                    WHERE
                                                        ?# = ?d",
                                                    $this->table,
                                                    $this->idField,
                                                    $this->id
                                                );
                $this->dataStart = $this->data;
            }
        }

        public function __set($key, $value)
        {
            if ($this->isDel)
            {
                trigger_error("Can not change removed object!", E_USER_ERROR);
            }

            if ($this->readOnly)
            {
                trigger_error("Can not change readonly object!", E_USER_ERROR);
            }

            if ($key == $this->idField)
            {
                trigger_error("Can not change id field!", E_USER_ERROR);
            }

            return $this->data[$key] = $value;
        }

        public function __get($key)
        {
            // Нельзя получать данные из объекта который удалён
            if ($this->isDel)
            {
                trigger_error("Can not get value from removed object!", E_USER_ERROR);
            }

            // Если спрашивают ключевое поле, но сейчас идёт только заполнение данных то пытаетмся сделать запись в БД и вернуть id который она скажет
            if (in_array($key, array($this->idField, 'id')) && !$this->id && count($this->data))
            {
                return $this->Flush();
            }
            return $this->data[$key];
        }

        public function Flush()
        {
            $ret = false;

            if ($this->readOnly)
            {
                return $this->id ? $this->id : false;
            }
            
            if ($this->isDel)
            {
                return $ret;
            }

            if (count($this->data))
            {
                if ($this->id)
                {
                    if ($this->dataStart != $this->data)
                    {
                        $data = array();
                        foreach ($this->data as $k => $v)
                        {
                            if ($k == $this->idField) continue;
                            $data[$k] = $v;
                        }

                        $ret = $this->db->query("UPDATE
                                                    ?#
                                                SET
                                                    ?a
                                                WHERE
                                                    ?# = ?d",
                                                    $this->table,
                                                    $data,
                                                    $this->idField,
                                                    $this->id
                                               );

                        $this->dataStart = $this->data;
                    }

                    $ret = $this->id;
                }
                else
                {
                    $ret = $this->db->query("INSERT INTO
                                                ?#(?#)
                                            VALUES
                                                (?a)",
                                                $this->table,
                                                array_keys($this->data),
                                                array_values($this->data)
                                           );

                    $this->id = $this->data[$this->idField] = $ret;
                }
            }
            return $ret;
        }

        public function IsExists()
        {
            return $this->db->selectCell("SELECT COUNT(*) FROM ?# WHERE ?# = ?d", $this->table, $this->idField, $this->id) > 0;
        }

        public function HasChanges()
        {
            return $this->data != $this->dataStart;
        }

        public function IsOnlyShow()
        {
            return $this->readOnly;
        }

        public function IsDeleted()
        {
            return $this->isDel;
        }

        public function Delete()
        {
            $ret = false;
            if ($this->readOnly || $this->isDel)
            {
                return $ret;
            }

            if ($this->id)
            {
                $ret = $this->db->query("DELETE FROM ?# WHERE ?# = ?d",
                                                    $this->table,
                                                    $this->idField,
                                                    $this->id);
            }
            $this->isDel = $ret;

            return $ret;
        }

        public function __destruct()
        {
            return $this->Flush();
        }
    };
?>
