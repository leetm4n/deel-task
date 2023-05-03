import { Sequelize } from 'sequelize';
import { ContractStatus, ProfileType, initModels } from '../entities/model';
/* WARNING THIS WILL DROP THE CURRENT DATABASE */

export async function seed(sequelize?: Sequelize): Promise<void> {
  if (!sequelize) {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite3',
      logging: false,
    });
  }

  const models = initModels(sequelize);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { ProfileModel, ContractModel, JobModel } = models;
  // create tables
  await ProfileModel.sync({ force: true });
  await ContractModel.sync({ force: true });
  await JobModel.sync({ force: true });
  //insert data
  await Promise.all([
    ProfileModel.create({
      id: 1,
      firstName: 'Harry',
      lastName: 'Potter',
      profession: 'Wizard',
      balance: 1150,
      type: ProfileType.CLIENT,
    }),
    ProfileModel.create({
      id: 2,
      firstName: 'Mr',
      lastName: 'Robot',
      profession: 'Hacker',
      balance: 231.11,
      type: ProfileType.CLIENT,
    }),
    ProfileModel.create({
      id: 3,
      firstName: 'John',
      lastName: 'Snow',
      profession: 'Knows nothing',
      balance: 451.3,
      type: ProfileType.CLIENT,
    }),
    ProfileModel.create({
      id: 4,
      firstName: 'Ash',
      lastName: 'Kethcum',
      profession: 'Pokemon master',
      balance: 1.3,
      type: ProfileType.CLIENT,
    }),
    ProfileModel.create({
      id: 5,
      firstName: 'John',
      lastName: 'Lenon',
      profession: 'Musician',
      balance: 64,
      type: ProfileType.CONTRACTOR,
    }),
    ProfileModel.create({
      id: 6,
      firstName: 'Linus',
      lastName: 'Torvalds',
      profession: 'Programmer',
      balance: 1214,
      type: ProfileType.CONTRACTOR,
    }),
    ProfileModel.create({
      id: 7,
      firstName: 'Alan',
      lastName: 'Turing',
      profession: 'Programmer',
      balance: 22,
      type: ProfileType.CONTRACTOR,
    }),
    ProfileModel.create({
      id: 8,
      firstName: 'Aragorn',
      lastName: 'II Elessar Telcontarvalds',
      profession: 'Fighter',
      balance: 314,
      type: ProfileType.CONTRACTOR,
    }),
    ContractModel.create({
      id: 1,
      terms: 'bla bla bla',
      status: ContractStatus.TERMINATED,
      clientId: 1,
      contractorId: 5,
    }),
    ContractModel.create({
      id: 2,
      terms: 'bla bla bla',
      status: ContractStatus.IN_PROGRESS,
      clientId: 1,
      contractorId: 6,
    }),
    ContractModel.create({
      id: 3,
      terms: 'bla bla bla',
      status: ContractStatus.IN_PROGRESS,
      clientId: 2,
      contractorId: 6,
    }),
    ContractModel.create({
      id: 4,
      terms: 'bla bla bla',
      status: ContractStatus.IN_PROGRESS,
      clientId: 2,
      contractorId: 7,
    }),
    ContractModel.create({
      id: 5,
      terms: 'bla bla bla',
      status: ContractStatus.NEW,
      clientId: 3,
      contractorId: 8,
    }),
    ContractModel.create({
      id: 6,
      terms: 'bla bla bla',
      status: ContractStatus.IN_PROGRESS,
      clientId: 3,
      contractorId: 7,
    }),
    ContractModel.create({
      id: 7,
      terms: 'bla bla bla',
      status: ContractStatus.IN_PROGRESS,
      clientId: 4,
      contractorId: 7,
    }),
    ContractModel.create({
      id: 8,
      terms: 'bla bla bla',
      status: ContractStatus.IN_PROGRESS,
      clientId: 4,
      contractorId: 6,
    }),
    ContractModel.create({
      id: 9,
      terms: 'bla bla bla',
      status: ContractStatus.IN_PROGRESS,
      clientId: 4,
      contractorId: 8,
    }),
    JobModel.create({
      description: 'work',
      price: 200,
      contractId: 1,
    }),
    JobModel.create({
      description: 'work',
      price: 201,
      contractId: 2,
    }),
    JobModel.create({
      description: 'work',
      price: 202,
      contractId: 3,
    }),
    JobModel.create({
      description: 'work',
      price: 200,
      contractId: 4,
    }),
    JobModel.create({
      description: 'work',
      price: 200,
      contractId: 7,
    }),
    JobModel.create({
      description: 'work',
      price: 2020,
      paid: true,
      paymentDate: new Date('2020-08-15T19:11:26.737Z'),
      contractId: 7,
    }),
    JobModel.create({
      description: 'work',
      price: 200,
      paid: true,
      paymentDate: new Date('2020-08-15T19:11:26.737Z'),
      contractId: 2,
    }),
    JobModel.create({
      description: 'work',
      price: 200,
      paid: true,
      paymentDate: new Date('2020-08-16T19:11:26.737Z'),
      contractId: 3,
    }),
    JobModel.create({
      description: 'work',
      price: 200,
      paid: true,
      paymentDate: new Date('2020-08-17T19:11:26.737Z'),
      contractId: 1,
    }),
    JobModel.create({
      description: 'work',
      price: 200,
      paid: true,
      paymentDate: new Date('2020-08-17T19:11:26.737Z'),
      contractId: 5,
    }),
    JobModel.create({
      description: 'work',
      price: 21,
      paid: true,
      paymentDate: new Date('2020-08-10T19:11:26.737Z'),
      contractId: 1,
    }),
    JobModel.create({
      description: 'work',
      price: 21,
      paid: true,
      paymentDate: new Date('2020-08-15T19:11:26.737Z'),
      contractId: 2,
    }),
    JobModel.create({
      description: 'work',
      price: 121,
      paid: true,
      paymentDate: new Date('2020-08-15T19:11:26.737Z'),
      contractId: 3,
    }),
    JobModel.create({
      description: 'work',
      price: 121,
      paid: true,
      paymentDate: new Date('2020-08-14T23:11:26.737Z'),
      contractId: 3,
    }),
  ]);
}

if (require.main === module) {
  seed()
    .then(() => console.log('database seeded'))
    .catch(console.error);
}
