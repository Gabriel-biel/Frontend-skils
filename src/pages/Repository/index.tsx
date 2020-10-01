import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import { Header, RepositoryInfo, Issue } from './styles';

import logo from '../../assets/logo.svg'

import api from '../../services/api'

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  }
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  }
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]); // o [] informa que isso e um arry de issues

  useEffect(() => {
    /////////////////////////////////////////////////////////////////////////////
    ////Precisamos de uma chamada dupla a api que execute ao mesmo tempo, portando temos essas opções abaixo
    api.get(`repos/${params.repository}`).then((response) => {
      setRepository(response.data);
    })

    api.get(`repos/${params.repository}/issues`).then((response) => {
      setIssues(response.data);
    })
  }, [params.repository]);

  // async function loadData(): Promise<void> {
  //   const repository = await api.get(`repos/${params.repository}`);
  //   const issue = await api.get(`repos/${params.repository}/issue`);

  //   console.log(repository);
  //   console.log(issue);

  //   loadData();
  // }

  // }, [params.repository]);
  /////Essa acima não funcional para essa aplicação pois ela executa uma chamada por vez a api.
  // async function loadData(): Promise<void> {
  //   // Promise.all Realiza as duas chamadas a api ao mesmo tempo.
  //     const [repository, issue] = await Promise.all([
  //       api.get(`repos/${params.repository}`),
  //       api.get(`repos/${params.repository}/issues`),
  //     ]);

  //     console.log(repository);
  //     console.log(issue);
  //   }
  //   loadData();
  // }, [params.repository]);


  return (
    <>
      <Header>
        <img src={logo} height={25} alt={repository?.owner.login} />
        <Link to="/">
          <FiChevronLeft size={16} />
        Volar
     </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img src={repository.owner.avatar_url} alt="Imagem do Autor do Repositório" />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}
      {issues.map(issue => (
        <Issue>
          <a key={issue.id} href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        </Issue>
      ))}
    </>
  )
};

export default Repository;
