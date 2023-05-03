import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';

export enum ProfileType {
  CLIENT = 'client',
  CONTRACTOR = 'contractor',
}

export class ProfileModel extends Model<
  InferAttributes<ProfileModel, { omit: 'contractors' | 'clients' }>,
  InferCreationAttributes<ProfileModel, { omit: 'contractors' | 'clients' }>
> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare profession: string;
  declare balance: number;
  declare type: ProfileType;

  declare contractors?: NonAttribute<ContractModel>;
  declare clients?: NonAttribute<ContractModel>;
}

export class JobModel extends Model<
  InferAttributes<JobModel, { omit: 'contract' }>,
  InferCreationAttributes<JobModel, { omit: 'contract' }>
> {
  declare id: CreationOptional<number>;
  declare description: string;
  declare price: number;
  declare paid: CreationOptional<boolean>;
  declare paymentDate: CreationOptional<Date | null>;

  declare contractId: ForeignKey<ContractModel['id']>;
  declare contract?: NonAttribute<ContractModel>;
}

export enum ContractStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  TERMINATED = 'terminated',
}

export class ContractModel extends Model<
  InferAttributes<ContractModel, { omit: 'jobs' }>,
  InferCreationAttributes<ContractModel, { omit: 'jobs' }>
> {
  declare id: CreationOptional<number>;
  declare terms: string;
  declare status: ContractStatus;
  declare jobs?: NonAttribute<JobModel[]>;
  declare client?: NonAttribute<ProfileModel>;
  declare contractor?: NonAttribute<ProfileModel>;
  declare clientId: ForeignKey<ProfileModel['id']>;
  declare contractorId: ForeignKey<ProfileModel['id']>;
}

export const initModels = (
  sequelize: Sequelize,
): {
  ContractModel: typeof ContractModel;
  JobModel: typeof JobModel;
  ProfileModel: typeof ProfileModel;
} => {
  ProfileModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profession: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ProfileType)),
      },
    },
    { sequelize, tableName: 'profiles', timestamps: false },
  );
  JobModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      paymentDate: {
        type: DataTypes.DATE,
      },
    },
    { sequelize, tableName: 'jobs', timestamps: false },
  );

  ContractModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      terms: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ContractStatus)),
      },
    },
    { sequelize, tableName: 'contracts', timestamps: false },
  );

  // associations
  ProfileModel.hasMany(ContractModel, {
    as: 'contractor',
    foreignKey: 'contractorId',
  });
  ContractModel.belongsTo(ProfileModel, { as: 'contractor' });
  ProfileModel.hasMany(ContractModel, { as: 'client', foreignKey: 'clientId' });
  ContractModel.belongsTo(ProfileModel, { as: 'client' });
  ContractModel.hasMany(JobModel, { as: 'contract', foreignKey: 'contractId' });
  JobModel.belongsTo(ContractModel, { as: 'contract' });

  return {
    JobModel,
    ContractModel,
    ProfileModel,
  };
};
