import React, { FormEvent, useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import api from '../../services/api';


import { Title, Form, Repository, Error } from './styles'
import { FiChevronRight } from 'react-icons/fi'
import logo from '../../assets/logo.svg'

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    } else {
      return [];
    }

  });

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories])

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    //Adição de um novo repositório
    //Consumir api do github
    //Salvar novo repositório no estado
    event.preventDefault();

    if (!newRepo) {
      setInputError("Digite o autor/nome do Repositório");
      console.log(inputError);
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);
      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca por esse repositório');
    }

  }

  return (
    <>

      <img src={logo} height={25} alt="Github Explore" />

      <Title>Explore repositórios no GitHub</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o Nome do Repositório" />
        <button type="submit">Pesquisar</button>
      </Form>
      { inputError && <Error>{inputError}</Error>}
      <Repository>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}.</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repository>
    </>
  );
}

export default Dashboard;
