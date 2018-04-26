--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3
-- Dumped by pg_dump version 10.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: messages; Type: TABLE; Schema: chatschema; Owner: postgres
--

CREATE TABLE chatschema.messages (
    id integer NOT NULL,
    "timestamp" timestamp(0) without time zone DEFAULT now(),
    sender character varying(30),
    message text
);


ALTER TABLE chatschema.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: chatschema; Owner: postgres
--

CREATE SEQUENCE chatschema.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE chatschema.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: chatschema; Owner: postgres
--

ALTER SEQUENCE chatschema.messages_id_seq OWNED BY chatschema.messages.id;


--
-- Name: messages id; Type: DEFAULT; Schema: chatschema; Owner: postgres
--

ALTER TABLE ONLY chatschema.messages ALTER COLUMN id SET DEFAULT nextval('chatschema.messages_id_seq'::regclass);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: chatschema; Owner: postgres
--

COPY chatschema.messages (id, "timestamp", sender, message) FROM stdin;
\.


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: chatschema; Owner: postgres
--

SELECT pg_catalog.setval('chatschema.messages_id_seq', 1, false);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: chatschema; Owner: postgres
--

ALTER TABLE ONLY chatschema.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

